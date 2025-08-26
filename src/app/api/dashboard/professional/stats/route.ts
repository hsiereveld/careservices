import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { booking, service, user, review, transaction } from '@/lib/schema'
import { eq, and, gte, lte, count, sql, sum } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const headersList = headers()
    const authHeader = headersList.get('authorization')
    
    // TODO: Implement proper auth check with better-auth
    // For now, we'll use a dummy user ID for development
    const userId = 'dummy-user-id'

    // Get current date for calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // This month's earnings
    const monthlyEarnings = await db
      .select({ 
        total: sum(transaction.amount),
        count: count()
      })
      .from(transaction)
      .where(
        and(
          eq(transaction.recipientId, userId),
          gte(transaction.createdAt, startOfMonth),
          lte(transaction.createdAt, endOfMonth),
          eq(transaction.type, 'payment')
        )
      )

    // Last month's earnings for comparison
    const lastMonthEarnings = await db
      .select({ 
        total: sum(transaction.amount)
      })
      .from(transaction)
      .where(
        and(
          eq(transaction.recipientId, userId),
          gte(transaction.createdAt, startOfLastMonth),
          lte(transaction.createdAt, endOfLastMonth),
          eq(transaction.type, 'payment')
        )
      )

    // Active clients (unique clients with bookings this month)
    const activeClients = await db
      .select({ 
        clientCount: count(sql`DISTINCT ${booking.clientId}`)
      })
      .from(booking)
      .where(
        and(
          eq(booking.professionalId, userId),
          gte(booking.createdAt, startOfMonth),
          lte(booking.createdAt, endOfMonth)
        )
      )

    // New clients this week
    const newClientsThisWeek = await db
      .select({ 
        clientCount: count(sql`DISTINCT ${booking.clientId}`)
      })
      .from(booking)
      .where(
        and(
          eq(booking.professionalId, userId),
          gte(booking.createdAt, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
          lte(booking.createdAt, now)
        )
      )

    // Upcoming appointments (next 3 days)
    const upcomingAppointments = await db
      .select({ count: count() })
      .from(booking)
      .where(
        and(
          eq(booking.professionalId, userId),
          gte(booking.scheduledDate, now),
          lte(booking.scheduledDate, new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)),
          sql`${booking.status} IN ('confirmed', 'pending')`
        )
      )

    // Average rating
    const averageRating = await db
      .select({ 
        avgRating: sql<number>`AVG(${review.rating})`,
        totalReviews: count()
      })
      .from(review)
      .where(eq(review.professionalId, userId))

    // Today's schedule
    const todaySchedule = await db
      .select({
        id: booking.id,
        scheduledDate: booking.scheduledDate,
        status: booking.status,
        serviceName: service.name,
        clientName: sql<string>`CONCAT(${user.firstName}, ' ', ${user.lastName})`,
        amount: transaction.amount
      })
      .from(booking)
      .leftJoin(service, eq(booking.serviceId, service.id))
      .leftJoin(user, eq(booking.clientId, user.id))
      .leftJoin(transaction, eq(booking.id, transaction.bookingId))
      .where(
        and(
          eq(booking.professionalId, userId),
          gte(booking.scheduledDate, new Date(now.getFullYear(), now.getMonth(), now.getDate())),
          lte(booking.scheduledDate, new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))
        )
      )
      .orderBy(booking.scheduledDate)

    // Performance metrics
    const performanceMetrics = await db
      .select({
        totalBookings: count(),
        completedBookings: count(sql`CASE WHEN ${booking.status} = 'completed' THEN 1 END`),
        responseTime: sql<number>`AVG(EXTRACT(EPOCH FROM (${booking.updatedAt} - ${booking.createdAt}))/3600)`
      })
      .from(booking)
      .where(
        and(
          eq(booking.professionalId, userId),
          gte(booking.createdAt, startOfMonth),
          lte(booking.createdAt, endOfMonth)
        )
      )

    // Calculate percentage changes
    const currentEarnings = monthlyEarnings[0]?.total || 0
    const lastEarnings = lastMonthEarnings[0]?.total || 0
    const earningsChange = lastEarnings > 0 ? ((currentEarnings - lastEarnings) / lastEarnings) * 100 : 0

    const stats = {
      monthlyEarnings: currentEarnings,
      earningsChange: Math.round(earningsChange * 100) / 100,
      activeClients: activeClients[0]?.clientCount || 0,
      newClientsThisWeek: newClientsThisWeek[0]?.clientCount || 0,
      upcomingAppointments: upcomingAppointments[0]?.count || 0,
      averageRating: averageRating[0]?.avgRating || 0,
      totalReviews: averageRating[0]?.totalReviews || 0,
      todaySchedule,
      performanceMetrics: {
        bookingRate: performanceMetrics[0]?.totalBookings > 0 
          ? Math.round((performanceMetrics[0].completedBookings / performanceMetrics[0].totalBookings) * 100)
          : 0,
        responseTime: performanceMetrics[0]?.responseTime || 0
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching professional dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
