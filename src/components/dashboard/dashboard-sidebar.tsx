'use client'

import { useAuth } from '@/contexts/auth-context'
import { RoleNavigation } from './role-navigation'

export function DashboardSidebar() {
  const { user } = useAuth()

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'client':
        return 'Client'
      case 'pro':
        return 'Professional'
      case 'franchise':
        return 'Franchise'
      case 'admin':
        return 'Administrator'
      default:
        return 'User'
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo/Brand */}
      <div className="flex items-center h-24 px-4 pt-8 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CS</span>
          </div>
          <span className="ml-2 text-lg font-semibold text-gray-900">CareService</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <RoleNavigation />
      </div>

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
              {getRoleDisplayName(user?.role || '')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}