'use client'

import { usePathname } from 'next/navigation'
import { SiteHeader } from './site-header'

export function ConditionalSiteHeader() {
  const pathname = usePathname()
  
  // Don't render site header on dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return null
  }
  
  return <SiteHeader />
}