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
import { Bell, Search, Settings, User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'

export function DashboardHeader() {
  const { user } = useAuth()
  const router = useRouter()

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
    <div className="flex items-center justify-between w-full">
      {/* Search bar - hidden on mobile */}
      <div className="hidden md:block flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="p-2">
          <Bell className="w-5 h-5 text-gray-600" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-2">
              <Avatar className="w-8 h-8">
                <div className="w-full h-full bg-primary-500 flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{getRoleDisplayName(user?.role || '')}</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
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
            
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}