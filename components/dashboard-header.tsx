import type React from "react"

interface DashboardHeaderProps {
  children: React.ReactNode
}

export function DashboardHeader({ children }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      {children}
    </header>
  )
}

