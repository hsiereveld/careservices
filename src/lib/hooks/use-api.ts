/**
 * SWR-based data fetching hooks for CareService platform
 */

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useAuth } from '@/contexts/auth-context'

// Generic fetcher with auth headers
const fetcher = async (url: string, token?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, { headers })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  return response.json()
}

// Generic mutation handler
const mutationFetcher = async (
  url: string, 
  { arg }: { arg: { method?: string; data?: any; token?: string } }
) => {
  const { method = 'POST', data, token } = arg
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  return response.json()
}

// Auth-aware hook wrapper
export function useAuthenticatedAPI() {
  const { user, session } = useAuth()
  
  return {
    user,
    token: session?.token,
    isAuthenticated: !!user
  }
}

// Services API hooks
export function useServices(filters?: { category?: string; location?: string }) {
  const { token } = useAuthenticatedAPI()
  
  const queryParams = new URLSearchParams()
  if (filters?.category) queryParams.set('category', filters.category)
  if (filters?.location) queryParams.set('location', filters.location)
  
  const url = `/api/services${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  
  return useSWR(
    token ? [url, token] : null,
    ([url, token]) => fetcher(url, token),
    {
      refreshInterval: 30000, // 30 seconds
      revalidateOnFocus: true
    }
  )
}

export function useServiceCategories() {
  const { token } = useAuthenticatedAPI()
  
  return useSWR(
    token ? ['/api/service-categories', token] : null,
    ([url, token]) => fetcher(url, token),
    {
      refreshInterval: 0, // Categories don't change often
      revalidateOnFocus: false
    }
  )
}

// User Profile hooks  
export function useProfile() {
  const { token, user } = useAuthenticatedAPI()
  
  return useSWR(
    token && user ? ['/api/profile', token] : null,
    ([url, token]) => fetcher(url, token),
    {
      refreshInterval: 0,
      revalidateOnFocus: true
    }
  )
}

export function useUpdateProfile() {
  const { token } = useAuthenticatedAPI()
  
  return useSWRMutation(
    '/api/profile',
    mutationFetcher
  )
}

// Booking hooks (to be implemented)
export function useBookings(status?: string) {
  const { token, user } = useAuthenticatedAPI()
  
  const queryParams = new URLSearchParams()
  if (status) queryParams.set('status', status)
  
  const url = `/api/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  
  return useSWR(
    token && user ? [url, token] : null,
    ([url, token]) => fetcher(url, token),
    {
      refreshInterval: 10000, // 10 seconds - bookings change frequently
      revalidateOnFocus: true
    }
  )
}

export function useCreateBooking() {
  const { token } = useAuthenticatedAPI()
  
  return useSWRMutation(
    '/api/bookings',
    mutationFetcher
  )
}

export function useUpdateBooking(bookingId: string) {
  const { token } = useAuthenticatedAPI()
  
  return useSWRMutation(
    `/api/bookings/${bookingId}`,
    mutationFetcher
  )
}

// Messages hooks (to be implemented)
export function useMessages(bookingId: string) {
  const { token, user } = useAuthenticatedAPI()
  
  return useSWR(
    token && user && bookingId ? [`/api/messages/${bookingId}`, token] : null,
    ([url, token]) => fetcher(url, token),
    {
      refreshInterval: 5000, // 5 seconds - messages need frequent updates
      revalidateOnFocus: true
    }
  )
}

export function useSendMessage() {
  const { token } = useAuthenticatedAPI()
  
  return useSWRMutation(
    '/api/messages',
    mutationFetcher
  )
}

// Reviews hooks (to be implemented)
export function useReviews(userId?: string) {
  const { token, user } = useAuthenticatedAPI()
  
  const url = userId ? `/api/reviews?userId=${userId}` : '/api/reviews'
  
  return useSWR(
    token && user ? [url, token] : null,
    ([url, token]) => fetcher(url, token),
    {
      refreshInterval: 0,
      revalidateOnFocus: false
    }
  )
}

export function useCreateReview() {
  const { token } = useAuthenticatedAPI()
  
  return useSWRMutation(
    '/api/reviews',
    mutationFetcher
  )
}

// Dashboard stats hooks
export function useDashboardStats() {
  const { token, user } = useAuthenticatedAPI()
  
  return useSWR(
    token && user ? [`/api/dashboard/stats`, token] : null,
    ([url, token]) => fetcher(url, token),
    {
      refreshInterval: 60000, // 1 minute
      revalidateOnFocus: true
    }
  )
}