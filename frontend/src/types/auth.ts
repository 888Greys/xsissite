export interface User {
  id: number
  username: string
  email: string
  is_active: boolean
  is_verified: boolean
  role: 'user' | 'moderator' | 'admin'
  avatar_url?: string
  first_name?: string
  last_name?: string
  bio?: string
  phone?: string
  location?: string
  created_at: string
  updated_at?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface VerifyEmailRequest {
  email: string
  code: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  code: string
  new_password: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface UpdateProfileRequest {
  first_name?: string
  last_name?: string
  bio?: string
  phone?: string
  location?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface ApiResponse<T = any> {
  message?: string
  data?: T
}

export interface ApiError {
  detail: string
}

// Admin types
export interface AdminUserUpdate {
  role?: 'user' | 'moderator' | 'admin'
  is_active?: boolean
}

export interface UserListItem {
  id: number
  username: string
  email: string
  role: 'user' | 'moderator' | 'admin'
  is_active: boolean
  is_verified: boolean
  created_at: string
}