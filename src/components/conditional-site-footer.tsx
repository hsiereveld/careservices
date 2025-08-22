'use client'

import { usePathname } from 'next/navigation'
import { SiteFooter } from './site-footer'

export function ConditionalSiteFooter() {
  const pathname = usePathname()
  
  // Don't render site footer on dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return null
  }
  
  return <SiteFooter />
}