'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
  isActive?: boolean
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname()

  // Generate breadcrumbs from the current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    if (segments.length === 0) return breadcrumbs

    // Add dashboard home
    if (segments[0] === 'dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        href: '/dashboard',
      })

      // Add role-specific breadcrumb
      if (segments[1]) {
        const roleLabels: Record<string, string> = {
          client: 'Client Dashboard',
          professional: 'Professional Dashboard',
          franchise: 'Franchise Dashboard',
          admin: 'Admin Dashboard',
          profile: 'Profile',
          settings: 'Settings',
        }

        breadcrumbs.push({
          label: roleLabels[segments[1]] || segments[1].charAt(0).toUpperCase() + segments[1].slice(1),
          href: `/${segments.slice(0, 2).join('/')}`,
        })

        // Add additional segments
        for (let i = 2; i < segments.length; i++) {
          const segment = segments[i]
          const href = `/${segments.slice(0, i + 1).join('/')}`
          
          breadcrumbs.push({
            label: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
            href,
          })
        }
      }
    }

    // Mark the last item as active
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isActive = true
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-6">
      <Link 
        href="/" 
        className="flex items-center hover:text-primary-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
          
          {breadcrumb.isActive ? (
            <span className="font-medium text-gray-900">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              href={breadcrumb.href}
              className={cn(
                "hover:text-primary-600 transition-colors",
                index === breadcrumbs.length - 1 && "font-medium text-gray-900"
              )}
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}