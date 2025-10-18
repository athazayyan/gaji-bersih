/**
 * GET /api/admin/regulations/list
 * 
 * List all regulations with admin details
 * Admin-only endpoint with full metadata including uploader info
 */

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    await requireAdmin()
    const supabase = await createClient()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const regulationType = searchParams.get('type')
    const year = searchParams.get('year')
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = (supabase.from('regulations') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (regulationType) {
      query = query.eq('regulation_type', regulationType)
    }

    if (year) {
      query = query.eq('regulation_year', parseInt(year))
    }

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }

    // Full-text search
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,regulation_number.ilike.%${search}%`)
    }

    const { data: regulations, error: dbError } = await query

    if (dbError) {
      console.error('[Admin Regulations List] Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to fetch regulations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      regulations: regulations || [],
      total: regulations?.length || 0,
      limit,
      offset,
    })

  } catch (error: any) {
    console.error('[Admin Regulations List] Unexpected error:', error)
    
    // Handle admin auth errors
    if (error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    if (error.message === 'Forbidden: Admin access required') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
