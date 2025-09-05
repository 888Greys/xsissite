'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authApi } from '@/lib/api'
import { VerifyEmailRequest } from '@/types/auth'

const verifySchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
})

type VerifyForm = z.infer<typeof verifySchema>

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''
  
  const form = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: emailFromUrl,
      code: '',
    },
  })

  const verifyMutation = useMutation({
    mutationFn: (data: VerifyEmailRequest) => authApi.verifyEmail(data),
    onSuccess: () => {
      toast.success('Email verified successfully! You can now sign in.')
      router.push('/auth/login')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Verification failed'
      toast.error(message)
    },
  })

  const resendMutation = useMutation({
    mutationFn: (email: string) => authApi.resendVerification({ email }),
    onSuccess: () => {
      toast.success('Verification code sent! Check your email.')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to resend verification code'
      toast.error(message)
    },
  })

  const onSubmit = (data: VerifyForm) => {
    verifyMutation.mutate(data)
  }

  const handleResend = () => {
    const email = form.getValues('email')
    if (email) {
      resendMutation.mutate(email)
    } else {
      toast.error('Please enter your email address')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        {...field}
                        disabled={!!emailFromUrl}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter 6-digit code" 
                        maxLength={6}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={verifyMutation.isPending}
              >
                {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center space-y-2">
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={resendMutation.isPending}
              className="text-sm"
            >
              {resendMutation.isPending ? 'Sending...' : 'Resend verification code'}
            </Button>
            
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Already verified?{' '}
              <Link 
                href="/auth/login" 
                className="font-medium text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300"
              >
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
}