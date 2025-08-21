'use client'

import { useAuth } from '@/contexts/auth-context'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings, 
  Star,
  Briefcase,
  PieChart,
  Building,
  UserCheck,
  ClipboardList,
  DollarSign,
  Shield
} from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: any
}

const roleBasedNavigation = {
  client: [
    { name: 'Dashboard', href: '/dashboard/client', icon: Home },
    { name: 'Find Services', href: '/dashboard/client/services', icon: Users },
    { name: 'My Bookings', href: '/dashboard/client/bookings', icon: Calendar },
    { name: 'Messages', href: '/dashboard/client/messages', icon: MessageSquare },
    { name: 'Reviews', href: '/dashboard/client/reviews', icon: Star },
    { name: 'Settings', href: '/dashboard/client/settings', icon: Settings },
  ],
  pro: [
    { name: 'Dashboard', href: '/dashboard/professional', icon: Home },
    { name: 'Calendar', href: '/dashboard/professional/calendar', icon: Calendar },
    { name: 'Services', href: '/dashboard/professional/services', icon: Briefcase },
    { name: 'Clients', href: '/dashboard/professional/clients', icon: Users },
    { name: 'Messages', href: '/dashboard/professional/messages', icon: MessageSquare },
    { name: 'Reviews', href: '/dashboard/professional/reviews', icon: Star },
    { name: 'Earnings', href: '/dashboard/professional/earnings', icon: DollarSign },
    { name: 'Settings', href: '/dashboard/professional/settings', icon: Settings },
  ],
  franchise: [
    { name: 'Dashboard', href: '/dashboard/franchise', icon: Home },
    { name: 'Analytics', href: '/dashboard/franchise/analytics', icon: PieChart },
    { name: 'Professionals', href: '/dashboard/franchise/professionals', icon: UserCheck },
    { name: 'Services', href: '/dashboard/franchise/services', icon: Briefcase },
    { name: 'Bookings', href: '/dashboard/franchise/bookings', icon: Calendar },
    { name: 'Messages', href: '/dashboard/franchise/messages', icon: MessageSquare },
    { name: 'Reports', href: '/dashboard/franchise/reports', icon: ClipboardList },
    { name: 'Settings', href: '/dashboard/franchise/settings', icon: Settings },
  ],
  admin: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: Home },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: PieChart },
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Franchises', href: '/dashboard/admin/franchises', icon: Building },
    { name: 'Professionals', href: '/dashboard/admin/professionals', icon: UserCheck },
    { name: 'Services', href: '/dashboard/admin/services', icon: Briefcase },
    { name: 'Security', href: '/dashboard/admin/security', icon: Shield },
    { name: 'Reports', href: '/dashboard/admin/reports', icon: ClipboardList },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
}

export function DashboardSidebar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const navigation = roleBasedNavigation[user?.role as keyof typeof roleBasedNavigation] || roleBasedNavigation.client

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo/Brand */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CS</span>
          </div>
          <span className="ml-2 text-lg font-semibold text-gray-900">CareService</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                'group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
                isActive 
                  ? 'text-primary-500' 
                  : 'text-gray-400 group-hover:text-gray-500'
              )} />
              {item.name}
            </button>
          )
        })}
      </nav>

      {/* Bottom section - User info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role === 'pro' ? 'Professional' : user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}