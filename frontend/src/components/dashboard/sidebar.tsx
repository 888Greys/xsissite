'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import { 
  Home,
  User,
  Shield,
  Settings,
  Users,
  LogOut,
  ChevronDown,
  Hash,
  Crown
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview'
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    description: 'Your profile'
  },
  {
    name: 'Security',
    href: '/dashboard/security',
    icon: Shield,
    description: 'Account security'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Preferences'
  }
]

const adminItems = [
  {
    name: 'Admin Panel',
    href: '/admin',
    icon: Crown,
    description: 'System administration'
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
    description: 'Manage users'
  }
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isAdmin = user?.role === 'admin'

  return (
    <div className={cn(
      "bg-[#2f3136] flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-60"
    )}>
      {/* Server Icon Area (Discord-style) */}
      <div className="p-3 border-b border-[#202225]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#5865f2] rounded-2xl flex items-center justify-center text-white font-bold text-lg hover:rounded-xl transition-all duration-200 cursor-pointer">
            A
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <h2 className="text-white font-semibold text-sm">Auth System</h2>
              <p className="text-[#b9bbbe] text-xs">Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-2 space-y-1">
        {/* Main Navigation */}
        <div className="space-y-0.5">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 group relative",
                  isActive 
                    ? "bg-[#5865f2]/10 text-white" 
                    : "text-[#b9bbbe] hover:bg-[#36393f] hover:text-white"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5865f2] rounded-r-full" />
                )}
                
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-[#5865f2]" : "text-[#b9bbbe] group-hover:text-white"
                )} />
                
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      {item.name === 'Dashboard' && (
                        <Hash className="w-4 h-4 text-[#72767d]" />
                      )}
                    </div>
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="pt-4">
            {!isCollapsed && (
              <div className="flex items-center space-x-2 px-2 py-1 mb-2">
                <div className="h-px bg-[#40444b] flex-1" />
                <span className="text-[#72767d] text-xs font-semibold uppercase tracking-wide">
                  Admin
                </span>
                <div className="h-px bg-[#40444b] flex-1" />
              </div>
            )}
            
            <div className="space-y-0.5">
              {adminItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 group relative",
                      isActive 
                        ? "bg-[#faa61a]/10 text-white" 
                        : "text-[#b9bbbe] hover:bg-[#36393f] hover:text-white"
                    )}
                  >
                    {/* Active indicator for admin */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#faa61a] rounded-r-full" />
                    )}
                    
                    <Icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-[#faa61a]" : "text-[#b9bbbe] group-hover:text-white"
                    )} />
                    
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* User Area (Discord-style) */}
      <div className="p-2 border-t border-[#202225]">
        <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#36393f] transition-colors cursor-pointer group">
          {/* Avatar */}
          <div className="relative">
            <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            {/* Online status */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#3ba55d] border-2 border-[#2f3136] rounded-full" />
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium truncate">
                    {user?.username}
                  </p>
                  <p className="text-[#b9bbbe] text-xs truncate">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#ed4245] rounded text-[#b9bbbe] hover:text-white"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#2f3136] border-2 border-[#202225] rounded-full flex items-center justify-center text-[#b9bbbe] hover:text-white transition-colors"
      >
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform",
          isCollapsed ? "rotate-90" : "-rotate-90"
        )} />
      </button>
    </div>
  )
}