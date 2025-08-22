'use client'

import { useAuth } from '@/contexts/auth-context'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { DashboardBreadcrumbs } from './dashboard-breadcrumbs'
import { Bell, Search, Settings, User, LogOut, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { useState } from 'react'

export function DashboardHeader() {
  const { user } = useAuth()
  const router = useRouter()
  const [notificationCount] = useState(3) // Mock notification count

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

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
    <div className="w-full">
      <div className="flex items-center justify-between">
        {/* Search bar - hidden on mobile */}
        <div className="hidden md:block flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 text-sm"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 ml-auto">
          {/* Mobile search button */}
          <Button variant="ghost" size="sm" className="p-2 md:hidden">
            <Search className="w-5 h-5 text-gray-600" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                <Avatar className="w-8 h-8">
                  <div className="w-full h-full bg-primary-500 flex items-center justify-center text-white font-medium rounded-full">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{getRoleDisplayName(user?.role || '')}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                  <span className="text-xs text-primary-600 mt-1">{getRoleDisplayName(user?.role || '')}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-700">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Breadcrumbs */}
      <div className="mt-4">
        <DashboardBreadcrumbs />
      </div>
    </div>
  )
}