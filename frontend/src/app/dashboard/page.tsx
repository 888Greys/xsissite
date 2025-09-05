'use client'

import { useAuthStore } from '@/store/auth'
import Link from 'next/link'
import { 
  User,
  Shield,
  Crown,
  CheckCircle,
  AlertCircle,
  Calendar,
  Activity,
  Users,
  Settings,
  ArrowRight
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const getStatusColor = (isVerified: boolean) => {
    return isVerified ? 'text-[#3ba55d]' : 'text-[#faa61a]'
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-[#ed4245]'
      case 'moderator':
        return 'text-[#faa61a]'
      default:
        return 'text-[#5865f2]'
    }
  }

  return (
    <div className="p-6 bg-[#36393f] min-h-full">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#5865f2] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome back, {user?.username}!
              </h1>
              <div className="flex items-center space-x-4 text-sm">
                <span className={`flex items-center space-x-1 ${getRoleColor(user?.role || 'user')}`}>
                  <Crown className="w-4 h-4" />
                  <span className="capitalize">{user?.role}</span>
                </span>
                <span className={`flex items-center space-x-1 ${getStatusColor(user?.is_verified || false)}`}>
                  {user?.is_verified ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>{user?.is_verified ? 'Verified' : 'Unverified'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#2f3136] rounded-lg p-4 border border-[#202225] hover:border-[#5865f2]/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#5865f2]/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-[#5865f2]" />
              </div>
              <div>
                <p className="text-[#b9bbbe] text-sm">Account Status</p>
                <p className="text-white font-semibold">
                  {user?.is_verified ? 'Active' : 'Pending Verification'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#2f3136] rounded-lg p-4 border border-[#202225] hover:border-[#3ba55d]/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#3ba55d]/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#3ba55d]" />
              </div>
              <div>
                <p className="text-[#b9bbbe] text-sm">Security Level</p>
                <p className="text-white font-semibold">High</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2f3136] rounded-lg p-4 border border-[#202225] hover:border-[#faa61a]/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#faa61a]/10 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#faa61a]" />
              </div>
              <div>
                <p className="text-[#b9bbbe] text-sm">Last Login</p>
                <p className="text-white font-semibold">Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-[#2f3136] rounded-lg border border-[#202225] overflow-hidden">
            <div className="p-4 border-b border-[#202225]">
              <h2 className="text-white font-semibold flex items-center space-x-2">
                <User className="w-5 h-5 text-[#5865f2]" />
                <span>Profile Information</span>
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#b9bbbe] text-sm">Username</span>
                  <span className="text-white font-medium">{user?.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#b9bbbe] text-sm">Email</span>
                  <span className="text-white font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#b9bbbe] text-sm">Role</span>
                  <span className={`font-medium capitalize ${getRoleColor(user?.role || 'user')}`}>
                    {user?.role}
                  </span>
                </div>
              </div>
              <Link
                href="/dashboard/profile"
                className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>Edit Profile</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-[#2f3136] rounded-lg border border-[#202225] overflow-hidden">
            <div className="p-4 border-b border-[#202225]">
              <h2 className="text-white font-semibold flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#3ba55d]" />
                <span>Account Security</span>
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#3ba55d]" />
                  <div>
                    <p className="text-white text-sm font-medium">Password Protected</p>
                    <p className="text-[#b9bbbe] text-xs">Strong password encryption</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {user?.is_verified ? (
                    <CheckCircle className="w-5 h-5 text-[#3ba55d]" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[#faa61a]" />
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">Email Verification</p>
                    <p className="text-[#b9bbbe] text-xs">
                      {user?.is_verified ? 'Email verified' : 'Verification pending'}
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard/security"
                className="w-full bg-[#3ba55d] hover:bg-[#2d7d32] text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>Security Settings</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="bg-[#2f3136] rounded-lg border border-[#faa61a]/20 overflow-hidden">
            <div className="p-4 border-b border-[#202225] bg-[#faa61a]/5">
              <h2 className="text-white font-semibold flex items-center space-x-2">
                <Crown className="w-5 h-5 text-[#faa61a]" />
                <span>Administrator Panel</span>
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/admin"
                  className="bg-[#36393f] hover:bg-[#40444b] border border-[#202225] rounded-lg p-4 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#faa61a]/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-[#faa61a]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">System Settings</p>
                      <p className="text-[#b9bbbe] text-sm">Configure system parameters</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#b9bbbe] group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>

                <Link
                  href="/admin/users"
                  className="bg-[#36393f] hover:bg-[#40444b] border border-[#202225] rounded-lg p-4 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#5865f2]/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#5865f2]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">User Management</p>
                      <p className="text-[#b9bbbe] text-sm">Manage user accounts and roles</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#b9bbbe] group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-[#2f3136] rounded-lg border border-[#202225] overflow-hidden">
          <div className="p-4 border-b border-[#202225]">
            <h2 className="text-white font-semibold">Quick Actions</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link
                href="/dashboard/profile"
                className="bg-[#36393f] hover:bg-[#40444b] text-[#b9bbbe] hover:text-white py-3 px-4 rounded-md text-sm font-medium transition-colors text-center"
              >
                Update Profile
              </Link>
              <Link
                href="/dashboard/avatar"
                className="bg-[#36393f] hover:bg-[#40444b] text-[#b9bbbe] hover:text-white py-3 px-4 rounded-md text-sm font-medium transition-colors text-center"
              >
                Change Avatar
              </Link>
              <Link
                href="/dashboard/security"
                className="bg-[#36393f] hover:bg-[#40444b] text-[#b9bbbe] hover:text-white py-3 px-4 rounded-md text-sm font-medium transition-colors text-center"
              >
                Change Password
              </Link>
              <Link
                href="/dashboard/settings"
                className="bg-[#36393f] hover:bg-[#40444b] text-[#b9bbbe] hover:text-white py-3 px-4 rounded-md text-sm font-medium transition-colors text-center"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}