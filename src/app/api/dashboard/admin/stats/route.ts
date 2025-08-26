import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user, booking, service, transaction, franchise } from '@/lib/schema'
import { eq, and, gte, lte, count, sql, sum } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const headersList = headers()
    const authHeader = headersList.get('authorization')
    
    // TODO: Implement proper auth check with better-auth
    // For now, continue with stats fetching for admin

    // Get current date for calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Total users
    const totalUsers = await db
      .select({ count: count() })
      .from(user)

    // New users this week
    const newUsersThisWeek = await db
      .select({ count: count() })
      .from(user)
      .where(
        and(
          gte(user.createdAt, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
          lte(user.createdAt, now)
        )
      )

    // Active franchises
    const activeFranchises = await db
      .select({ count: count() })
      .from(franchise)
      .where(eq(franchise.status, 'active'))

    // Monthly revenue
    const monthlyRevenue = await db
      .select({ 
        total: sum(transaction.amount)
      })
      .from(transaction)
      .where(
        and(
          gte(transaction.createdAt, startOfMonth),
          lte(transaction.createdAt, endOfMonth),
          eq(transaction.type, 'payment')
        )
      )

    // Last month revenue for comparison
    const lastMonthRevenue = await db
      .select({ 
        total: sum(transaction.amount)
      })
      .from(transaction)
      .where(
        and(
          gte(transaction.createdAt, startOfLastMonth),
          lte(transaction.createdAt, endOfLastMonth),
          eq(transaction.type, 'payment')
        )
      )

    // Platform growth metrics
    const platformGrowth = await db
      .select({
        newUsers30Days: count(sql`CASE WHEN ${user.createdAt} >= ${new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)} THEN 1 END`),
        activeProfessionals: count(sql`CASE WHEN ${user.role} = 'pro' AND ${user.status} = 'active' THEN 1 END`),
        totalBookings: count(),
        completedBookings: count(sql`CASE WHEN ${booking.status} = 'completed' THEN 1 END`)
      })
      .from(user)
      .leftJoin(booking, eq(user.id, booking.clientId))

    // System health metrics (simplified - would be more complex in production)
    const systemHealth = {
      apiResponseTime: 148, // ms - would be measured in production
      databasePerformance: 'Optimal',
      serverLoad: 67, // percentage - would be measured in production
      securityStatus: 'Secure',
      uptime: 99.9 // percentage
    }

    // Critical alerts (placeholder - would be real system monitoring)
    const criticalAlerts = [
      {
        id: 1,
        type: 'warning',
        title: 'High Memory Usage',
        description: 'Server cluster at 89% capacity',
        severity: 'high'
      },
      {
        id: 2,
        type: 'info',
        title: 'Pending Reviews',
        description: '15 franchise applications awaiting review',
        severity: 'medium'
      }
    ]

    // Recent admin activity (placeholder - would be audit logs)
    const recentActivity = [
      {
        id: 1,
        action: 'New franchise approved: Toronto East',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: 'franchise_approval'
      },
      {
        id: 2,
        action: 'Security policy updated',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
        type: 'security_update'
      },
      {
        id: 3,
        action: 'Professional verification batch completed',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        type: 'verification'
      }
    ]

    // Calculate percentage changes
    const currentRevenue = monthlyRevenue[0]?.total || 0
    const lastRevenue = lastMonthRevenue[0]?.total || 0
    const revenueChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0

    const stats = {
      totalUsers: totalUsers[0]?.count || 0,
      newUsersThisWeek: newUsersThisWeek[0]?.count || 0,
      activeFranchises: activeFranchises[0]?.count || 0,
      monthlyRevenue: currentRevenue,
      revenueChange: Math.round(revenueChange * 100) / 100,
      systemHealth,
      criticalAlerts,
      recentActivity,
      platformGrowth: {
        newUsers30Days: platformGrowth[0]?.newUsers30Days || 0,
        activeProfessionals: platformGrowth[0]?.activeProfessionals || 0,
        bookingCompletionRate: platformGrowth[0]?.totalBookings > 0 
          ? Math.round((platformGrowth[0].completedBookings / platformGrowth[0].totalBookings) * 100 * 10) / 10
          : 0
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
