"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTopProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)

useEffect(() => {
  if (prevPathname.current === pathname) return
  prevPathname.current = pathname

  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 100)
}, [pathname])

  return <>{children}</>
}