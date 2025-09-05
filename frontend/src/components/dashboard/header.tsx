'use client'

import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { 
  Hash,
  Search,
  Bell,
  HelpCircle,
  Settings,
  Users,
  AtSign
} from 'lucide-react'

const getPageInfo = (pathname: string) => {
  switch (pathname) {
    case '/dashboard':
      return { title: 'dashboard', subtitle: 'Welcome to your dashboard' }
    case '/dashboard/profile':
      return { title: 'profile', subtitle: 'Manage your profile information' }
    case '/dashboard/security':
      return { title: 'security', subtitle: 'Account security settings' }
    case '/dashboard/settings':
      return { title: 'settings', subtitle: 'Customize your experience' }
    case '/admin':
      return { title: 'admin-panel', subtitle: 'System administration' }
    case '/admin/users':
      return { title: 'user-management', subtitle: 'Manage system users' }
    default:
      return { title: 'dashboard', subtitle: 'Welcome back' }
  }
}

export function DashboardHeader() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const pageInfo = getPageInfo(pathname)

  return (
    <header className="h-12 bg-[#36393f] border-b border-[#202225] flex items-center px-4">
      {/* Channel/Page Info */}
      <div className="flex items-center space-x-2 flex-1">
        <Hash className="w-5 h-5 text-[#72767d]" />
        <h1 className="text-white font-semibold text-base">
          {pageInfo.title}
        </h1>
        <div className="h-4 w-px bg-[#40444b] mx-2" />
        <p className="text-[#b9bbbe] text-sm">
          {pageInfo.subtitle}
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-2">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-36 h-6 bg-[#202225] text-[#dcddde] text-sm rounded px-2 pl-6 placeholder-[#72767d] focus:outline-none focus:ring-1 focus:ring-[#5865f2] transition-all"
          />
          <Search className="absolute left-1.5 top-1 w-3 h-3 text-[#72767d]" />
        </div>

        {/* Action Buttons */}
        <button className="p-1 text-[#b9bbbe] hover:text-white transition-colors rounded hover:bg-[#40444b]">
          <Bell className="w-5 h-5" />
        </button>
        
        <button className="p-1 text-[#b9bbbe] hover:text-white transition-colors rounded hover:bg-[#40444b]">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User indicator */}
        <div className="flex items-center space-x-2 ml-2">
          <div className="w-6 h-6 bg-[#5865f2] rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-[#3ba55d] rounded-full" />
            <span className="text-[#b9bbbe] text-sm font-medium">
              {user?.username}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}