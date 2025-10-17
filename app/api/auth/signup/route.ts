/**
 * POST /api/auth/signup
 * 
 * Register a new user with email and password
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required').optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = signUpSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      let errorMessage = firstError.message
      
      // Handle missing required fields
      if (errorMessage.includes('expected string, received undefined') || 
          errorMessage === 'Required') {
        const fieldName = firstError.path.join('.') || 'field'
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
      }
        
      return NextResponse.json(
        { 
          error: errorMessage,
          field: firstError.path.join('.') || 'unknown'
        },
        { status: 400 }
      )
    }

    const { email, password, full_name } = validation.data
    const supabase = await createClient()

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || '',
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error('[Auth] Sign up error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Sign up successful. Please check your email for verification.',
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
      },
      session: data.session,
    }, { status: 201 })

  } catch (error) {
    console.error('[Auth] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
