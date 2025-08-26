import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { booking, service, user, review } from '@/lib/schema'
import { eq, and, gte, lte, count, sql } from 'drizzle-orm'
import { headers } from 'next/headers'

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

    // Active bookings (status: 'confirmed', 'in_progress')
    const activeBookings = await db
      .select({ count: count() })
      .from(booking)
      .where(
        and(
          eq(booking.clientId, userId),
          sql`${booking.status} IN ('confirmed', 'in_progress')`
        )
      )

    // Total bookings this month
    const monthlyBookings = await db
      .select({ count: count() })
      .from(booking)
      .where(
        and(
          eq(booking.clientId, userId),
          gte(booking.createdAt, startOfMonth),
          lte(booking.createdAt, endOfMonth)
        )
      )

    // Favorite professionals (professionals with multiple bookings)
    const favoritePros = await db
      .select({ 
        professionalId: booking.professionalId,
        bookingCount: count()
      })
      .from(booking)
      .where(eq(booking.clientId, userId))
      .groupBy(booking.professionalId)
      .having(sql`count(*) > 1`)
      .limit(5)

    // Unread messages (placeholder - will be implemented with messages system)
    const unreadMessages = { count: 0 }

    // Reviews given
    const reviewsGiven = await db
      .select({ count: count() })
      .from(review)
      .where(eq(review.clientId, userId))

    // Recent activity (last 5 bookings)
    const recentActivity = await db
      .select({
        id: booking.id,
        status: booking.status,
        createdAt: booking.createdAt,
        serviceName: service.name,
        professionalName: sql<string>`CONCAT(${user.firstName}, ' ', ${user.lastName})`
      })
      .from(booking)
      .leftJoin(service, eq(booking.serviceId, service.id))
      .leftJoin(user, eq(booking.professionalId, user.id))
      .where(eq(booking.clientId, userId))
      .orderBy(sql`${booking.createdAt} DESC`)
      .limit(5)

    // Upcoming appointments (next 7 days)
    const upcomingAppointments = await db
      .select({
        id: booking.id,
        scheduledDate: booking.scheduledDate,
        serviceName: service.name,
        professionalName: sql<string>`CONCAT(${user.firstName}, ' ', ${user.lastName})`,
        professionalInitials: sql<string>`CONCAT(LEFT(${user.firstName}, 1), LEFT(${user.lastName}, 1))`,
        status: booking.status
      })
      .from(booking)
      .leftJoin(service, eq(booking.serviceId, service.id))
      .leftJoin(user, eq(booking.professionalId, user.id))
      .where(
        and(
          eq(booking.clientId, userId),
          gte(booking.scheduledDate, now),
          lte(booking.scheduledDate, new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)),
          sql`${booking.status} IN ('confirmed', 'pending')`
        )
      )
      .orderBy(booking.scheduledDate)

    const stats = {
      activeBookings: activeBookings[0]?.count || 0,
      monthlyBookings: monthlyBookings[0]?.count || 0,
      favoritePros: favoritePros.length,
      unreadMessages: unreadMessages.count,
      reviewsGiven: reviewsGiven[0]?.count || 0,
      recentActivity,
      upcomingAppointments
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching client dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
