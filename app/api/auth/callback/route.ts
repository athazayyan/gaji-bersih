/**
 * GET /api/auth/callback
 * 
 * Handle OAuth callback and email verification redirects
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('[Auth] Code exchange error:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/error?message=${encodeURIComponent(error.message)}`
      )
    }
  }

  // Redirect to the requested page or home
  return NextResponse.redirect(`${requestUrl.origin}${next}`)
}
