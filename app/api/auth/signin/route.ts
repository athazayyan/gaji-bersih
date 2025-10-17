/**
 * POST /api/auth/signin
 * 
 * Sign in an existing user with email and password
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = signInSchema.safeParse(body)
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

    const { email, password } = validation.data
    const supabase = await createClient()

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('[Auth] Sign in error:', error)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Failed to sign in' },
        { status: 500 }
      )
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return NextResponse.json({
      message: 'Sign in successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: (profile as any)?.full_name || null,
        avatar_path: (profile as any)?.avatar_path || null,
        created_at: data.user.created_at,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    }, { status: 200 })

  } catch (error) {
    console.error('[Auth] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
