/**
 * GET /api/auth/me
 * 
 * Get current authenticated user profile
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[Auth] Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: (profile as any).full_name,
        avatar_path: (profile as any).avatar_path,
        role: (profile as any).role,
        created_at: user.created_at,
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

/**
 * PATCH /api/auth/me
 * 
 * Update current user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { full_name, avatar_path } = body

    // Update profile
    const { data: profile, error: updateError } = await (supabase
      .from('profiles') as any)
      .update({
        full_name: full_name !== undefined ? full_name : undefined,
        avatar_path: avatar_path !== undefined ? avatar_path : undefined,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('[Auth] Profile update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        full_name: (profile as any).full_name,
        avatar_path: (profile as any).avatar_path,
        created_at: user.created_at,
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
