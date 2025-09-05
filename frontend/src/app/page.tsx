'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Shield, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  Mail, 
  UserCheck,
  Database,
  Globe,
  Smartphone
} from 'lucide-react'

export default function Home() {
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    console.log('Home page - Auth state:', { isAuthenticated, user: user?.username })
  }, [isAuthenticated, user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">AuthSystem</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">{user?.username}</Badge>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              Production Ready
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              Enterprise-Grade
              <span className="text-primary block">Authentication System</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Secure, scalable, and modern authentication platform with advanced user management, 
              role-based access control, and seamless integration capabilities.
            </p>

            {isAuthenticated ? (
              <Card className="max-w-lg mx-auto mb-12">
                <CardHeader>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <CardTitle>Welcome back, {user?.username}!</CardTitle>
                  </div>
                  <CardDescription className="flex items-center justify-center space-x-4">
                    <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                      {user?.role}
                    </Badge>
                    <Badge variant={user?.is_verified ? 'default' : 'destructive'}>
                      {user?.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  {user?.role === 'admin' && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/auth/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">99.9%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">256-bit</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Encryption</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">GDPR</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Everything you need for authentication
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Built with modern technologies and security best practices to provide 
                a robust foundation for your applications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Secure Authentication</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    JWT-based authentication with bcrypt password hashing and secure session management.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Password strength validation
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Account lockout protection
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Secure password reset
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Email Verification</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Automated email verification system with OTP codes and SMTP integration.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      6-digit OTP codes
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Time-limited verification
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Resend functionality
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">User Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Complete user profile system with avatar uploads and role-based access control.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Profile management
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Avatar upload & processing
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Role-based permissions
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Modern Architecture</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Built with cutting-edge technologies for performance, scalability, and maintainability.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Next.js 15 + TypeScript
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      FastAPI + PostgreSQL
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Docker containerization
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Production Ready</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Deployed with HTTPS, SSL certificates, and production-grade security configurations.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      SSL/TLS encryption
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Nginx reverse proxy
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Auto-renewal certificates
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Responsive Design</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Mobile-first design with shadcn/ui components and Tailwind CSS for perfect UX.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Mobile-first approach
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Dark mode support
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Accessible components
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Ready to get started?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust our authentication system for their applications.
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/auth/register">
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold">AuthSystem</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-slate-100">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-slate-900 dark:hover:text-slate-100">
                Terms of Service
              </Link>
              <span>© 2024 AuthSystem. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}