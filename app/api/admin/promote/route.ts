/**
 * POST /api/admin/promote
 * 
 * TEMPORARY ENDPOINT FOR TESTING
 * Promote a user to admin role
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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

    // Update user role to admin
    const { error: updateError } = await (supabase
      .from('profiles') as any)
      .update({ role: 'admin' })
      .eq('id', user.id)

    if (updateError) {
      console.error('[Promote Admin] Error:', updateError)
      return NextResponse.json(
        { error: 'Failed to promote user' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'User promoted to admin successfully',
      user_id: user.id,
      email: user.email,
    })

  } catch (error) {
    console.error('[Promote Admin] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
