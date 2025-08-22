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
  Shield,
  Search,
  BookOpen,
  FileText,
  CreditCard,
  Heart,
  Bell,
  HelpCircle
} from 'lucide-react'
import { UserRole } from '@/lib/auth'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  badge?: string | number
  disabled?: boolean
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

const roleBasedNavigation: Record<UserRole, NavigationSection[]> = {
  client: [
    {
      title: 'Dashboard',
      items: [
        { name: 'Overview', href: '/dashboard/client', icon: Home, description: 'Your dashboard overview' },
        { name: 'Find Services', href: '/dashboard/client/services', icon: Search, description: 'Browse available services' },
      ]
    },
    {
      title: 'My Activity',
      items: [
        { name: 'My Bookings', href: '/dashboard/client/bookings', icon: Calendar, description: 'View and manage your bookings' },
        { name: 'Messages', href: '/dashboard/client/messages', icon: MessageSquare, description: 'Chat with professionals', badge: 2 },
        { name: 'Reviews', href: '/dashboard/client/reviews', icon: Star, description: 'Your reviews and ratings' },
        { name: 'Favorites', href: '/dashboard/client/favorites', icon: Heart, description: 'Your favorite services' },
      ]
    },
    {
      title: 'Account',
      items: [
        { name: 'Profile', href: '/dashboard/profile', icon: UserCheck, description: 'Manage your profile' },
        { name: 'Payment Methods', href: '/dashboard/client/payment', icon: CreditCard, description: 'Manage payment methods' },
        { name: 'Settings', href: '/dashboard/client/settings', icon: Settings, description: 'Account settings' },
        { name: 'Help & Support', href: '/dashboard/client/help', icon: HelpCircle, description: 'Get help and support' },
      ]
    },
  ],
  pro: [
    {
      title: 'Dashboard',
      items: [
        { name: 'Overview', href: '/dashboard/professional', icon: Home, description: 'Your professional dashboard' },
        { name: 'Calendar', href: '/dashboard/professional/calendar', icon: Calendar, description: 'Manage your schedule' },
      ]
    },
    {
      title: 'Business',
      items: [
        { name: 'Services', href: '/dashboard/professional/services', icon: Briefcase, description: 'Manage your services' },
        { name: 'Clients', href: '/dashboard/professional/clients', icon: Users, description: 'View and manage clients' },
        { name: 'Reviews', href: '/dashboard/professional/reviews', icon: Star, description: 'Client reviews and ratings' },
        { name: 'Earnings', href: '/dashboard/professional/earnings', icon: DollarSign, description: 'Track your earnings' },
      ]
    },
    {
      title: 'Communication',
      items: [
        { name: 'Messages', href: '/dashboard/professional/messages', icon: MessageSquare, description: 'Chat with clients', badge: 5 },
        { name: 'Notifications', href: '/dashboard/professional/notifications', icon: Bell, description: 'Manage notifications' },
      ]
    },
    {
      title: 'Account',
      items: [
        { name: 'Profile', href: '/dashboard/profile', icon: UserCheck, description: 'Manage your profile' },
        { name: 'Settings', href: '/dashboard/professional/settings', icon: Settings, description: 'Professional settings' },
        { name: 'Help & Resources', href: '/dashboard/professional/help', icon: HelpCircle, description: 'Professional resources' },
      ]
    },
  ],
  franchise: [
    {
      title: 'Dashboard',
      items: [
        { name: 'Overview', href: '/dashboard/franchise', icon: Home, description: 'Franchise dashboard overview' },
        { name: 'Analytics', href: '/dashboard/franchise/analytics', icon: PieChart, description: 'Business analytics' },
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Professionals', href: '/dashboard/franchise/professionals', icon: UserCheck, description: 'Manage professionals' },
        { name: 'Services', href: '/dashboard/franchise/services', icon: Briefcase, description: 'Manage service offerings' },
        { name: 'Bookings', href: '/dashboard/franchise/bookings', icon: Calendar, description: 'View all bookings' },
        { name: 'Clients', href: '/dashboard/franchise/clients', icon: Users, description: 'Client management' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Messages', href: '/dashboard/franchise/messages', icon: MessageSquare, description: 'Communication center' },
        { name: 'Reports', href: '/dashboard/franchise/reports', icon: ClipboardList, description: 'Business reports' },
        { name: 'Finance', href: '/dashboard/franchise/finance', icon: DollarSign, description: 'Financial overview' },
      ]
    },
    {
      title: 'Account',
      items: [
        { name: 'Profile', href: '/dashboard/profile', icon: UserCheck, description: 'Franchise profile' },
        { name: 'Settings', href: '/dashboard/franchise/settings', icon: Settings, description: 'Franchise settings' },
      ]
    },
  ],
  admin: [
    {
      title: 'Dashboard',
      items: [
        { name: 'Overview', href: '/dashboard/admin', icon: Home, description: 'System overview' },
        { name: 'Analytics', href: '/dashboard/admin/analytics', icon: PieChart, description: 'Platform analytics' },
      ]
    },
    {
      title: 'User Management',
      items: [
        { name: 'All Users', href: '/dashboard/admin/users', icon: Users, description: 'Manage all users' },
        { name: 'Franchises', href: '/dashboard/admin/franchises', icon: Building, description: 'Manage franchises' },
        { name: 'Professionals', href: '/dashboard/admin/professionals', icon: UserCheck, description: 'Manage professionals' },
      ]
    },
    {
      title: 'Platform',
      items: [
        { name: 'Services', href: '/dashboard/admin/services', icon: Briefcase, description: 'Manage service categories' },
        { name: 'Security', href: '/dashboard/admin/security', icon: Shield, description: 'Security settings' },
        { name: 'Reports', href: '/dashboard/admin/reports', icon: ClipboardList, description: 'System reports' },
        { name: 'Documentation', href: '/dashboard/admin/docs', icon: FileText, description: 'Admin documentation' },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings, description: 'System settings' },
      ]
    },
  ],
}

interface RoleNavigationProps {
  className?: string
  showSectionTitles?: boolean
  compact?: boolean
}

export function RoleNavigation({ 
  className, 
  showSectionTitles = true, 
  compact = false 
}: RoleNavigationProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const navigation = roleBasedNavigation[user?.role as UserRole] || roleBasedNavigation.client

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  }

  return (
    <nav className={cn('space-y-6', className)}>
      {navigation.map((section) => (
        <div key={section.title}>
          {showSectionTitles && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
          )}
          
          <ul className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    disabled={item.disabled}
                    className={cn(
                      'group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      active
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                      item.disabled && 'opacity-50 cursor-not-allowed',
                      compact ? 'px-2 py-1.5' : 'px-3 py-2'
                    )}
                  >
                    <Icon className={cn(
                      'flex-shrink-0 transition-colors',
                      active 
                        ? 'text-primary-500' 
                        : 'text-gray-400 group-hover:text-gray-500',
                      compact ? 'w-4 h-4 mr-2' : 'w-5 h-5 mr-3'
                    )} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          'truncate',
                          compact ? 'text-xs' : 'text-sm'
                        )}>
                          {item.name}
                        </span>
                        
                        {item.badge && (
                          <span className={cn(
                            'ml-2 inline-flex items-center justify-center rounded-full text-xs font-medium',
                            active
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-gray-100 text-gray-700',
                            compact ? 'w-4 h-4 text-xs' : 'w-5 h-5'
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      
                      {!compact && item.description && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}