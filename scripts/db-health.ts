#!/usr/bin/env tsx

import { db } from '../src/lib/db'
import { sql } from 'drizzle-orm'

async function checkDatabaseHealth() {
  console.log('🔍 Checking database health...\n')
  
  const checks = {
    connection: false,
    tables: false,
    counts: false,
    performance: false,
  }
  
  try {
    // 1. Check connection
    console.log('1. Testing database connection...')
    const result = await db.execute(sql`SELECT 1 as test`)
    if (result) {
      checks.connection = true
      console.log('   ✅ Database connection successful\n')
    }
    
    // 2. Check tables exist
    console.log('2. Checking required tables...')
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    
    const requiredTables = [
      'users',
      'profiles',
      'services',
      'bookings',
      'categories',
      'wallet',
      'wallet_transaction',
      'payout_request',
    ]
    
    const existingTables = (tables as any).map((row: any) => row.table_name)
    const missingTables = requiredTables.filter(t => !existingTables.includes(t))
    
    if (missingTables.length === 0) {
      checks.tables = true
      console.log(`   ✅ All ${requiredTables.length} required tables exist`)
    } else {
      console.log(`   ❌ Missing tables: ${missingTables.join(', ')}`)
    }
    console.log()
    
    // 3. Check record counts
    console.log('3. Checking record counts...')
    const counts: Record<string, number> = {}
    
    for (const table of requiredTables) {
      if (existingTables.includes(table)) {
        try {
          const countResult = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM ${table}`))
          counts[table] = Number((countResult as any)[0].count)
        } catch (e) {
          counts[table] = -1
        }
      }
    }
    
    console.log('   Table record counts:')
    Object.entries(counts).forEach(([table, count]) => {
      const icon = count > 0 ? '📊' : count === 0 ? '📭' : '❌'
      console.log(`   ${icon} ${table}: ${count === -1 ? 'Error' : count}`)
    })
    
    checks.counts = Object.values(counts).every(c => c >= 0)
    console.log()
    
    // 4. Check performance
    console.log('4. Testing query performance...')
    const perfStart = Date.now()
    
    // Run a moderately complex query
    await db.execute(sql`
      SELECT 
        u.id,
        u.email,
        p.first_name,
        p.last_name,
        COUNT(DISTINCT b.id) as booking_count
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN bookings b ON u.id = b.client_id
      GROUP BY u.id, u.email, p.first_name, p.last_name
      LIMIT 10
    `)
    
    const queryTime = Date.now() - perfStart
    console.log(`   ⏱️  Complex query executed in ${queryTime}ms`)
    
    if (queryTime < 1000) {
      checks.performance = true
      console.log('   ✅ Query performance is good\n')
    } else if (queryTime < 3000) {
      checks.performance = true
      console.log('   ⚠️  Query performance is acceptable but could be improved\n')
    } else {
      console.log('   ❌ Query performance is poor\n')
    }
    
    // 5. Check indexes
    console.log('5. Checking database indexes...')
    const indexes = await db.execute(sql`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `)
    
    const indexCount = (indexes as any).length
    console.log(`   📇 Found ${indexCount} indexes`)
    
    // Check for important indexes
    const importantIndexes = [
      'users_email',
      'bookings_client_id',
      'bookings_pro_id',
      'services_pro_id',
      'services_category_id',
    ]
    
    const existingIndexNames = (indexes as any).map((row: any) => row.indexname)
    const missingIndexes = importantIndexes.filter(idx => 
      !existingIndexNames.some((name: string) => name.includes(idx))
    )
    
    if (missingIndexes.length > 0) {
      console.log(`   ⚠️  Missing recommended indexes: ${missingIndexes.join(', ')}`)
    } else {
      console.log('   ✅ All recommended indexes exist')
    }
    console.log()
    
    // 6. Check database size
    console.log('6. Checking database size...')
    const sizeResult = await db.execute(sql`
      SELECT 
        pg_database_size(current_database()) as db_size,
        pg_size_pretty(pg_database_size(current_database())) as db_size_pretty
    `)
    
    const dbSize = (sizeResult as any)[0].db_size_pretty
    console.log(`   💾 Database size: ${dbSize}`)
    console.log()
    
    // 7. Check active connections
    console.log('7. Checking active connections...')
    const connections = await db.execute(sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE state = 'active') as active,
        COUNT(*) FILTER (WHERE state = 'idle') as idle
      FROM pg_stat_activity
      WHERE datname = current_database()
    `)
    
    const connInfo = (connections as any)[0]
    console.log(`   🔌 Connections: ${connInfo.total} total (${connInfo.active} active, ${connInfo.idle} idle)`)
    
    if (Number(connInfo.total) > 50) {
      console.log('   ⚠️  High number of connections detected')
    } else {
      console.log('   ✅ Connection count is healthy')
    }
    console.log()
    
    // Summary
    console.log('=' .repeat(50))
    console.log('📋 HEALTH CHECK SUMMARY:')
    console.log('=' .repeat(50))
    
    const allChecks = Object.values(checks).every(c => c)
    const checkResults = [
      `Connection: ${checks.connection ? '✅' : '❌'}`,
      `Tables: ${checks.tables ? '✅' : '❌'}`,
      `Data Integrity: ${checks.counts ? '✅' : '❌'}`,
      `Performance: ${checks.performance ? '✅' : '❌'}`,
    ]
    
    checkResults.forEach(result => console.log(`  ${result}`))
    console.log()
    
    if (allChecks) {
      console.log('🎉 Database is healthy!')
      process.exit(0)
    } else {
      console.log('⚠️  Some health checks failed. Please review the output above.')
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Database health check failed:', error)
    process.exit(1)
  }
}

// Run health check
checkDatabaseHealth().catch(console.error)