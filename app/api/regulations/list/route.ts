/**
 * GET /api/regulations/list
 * 
 * List regulations with filtering and search
 * Public endpoint - all authenticated users can access
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user (authentication required)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

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

    // Full-text search on title and description
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: regulations, error: dbError } = await query

    if (dbError) {
      console.error('[Regulations List] Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to fetch regulations' },
        { status: 500 }
      )
    }

    // Format response
    const formattedRegulations = regulations.map((reg: any) => ({
      id: reg.id,
      regulation_type: reg.regulation_type,
      regulation_number: reg.regulation_number,
      regulation_year: reg.regulation_year,
      title: reg.title,
      description: reg.description,
      file_name: reg.file_name,
      file_size: reg.file_size,
      issued_date: reg.issued_date,
      effective_date: reg.effective_date,
      tags: reg.tags,
      created_at: reg.created_at,
    }))

    return NextResponse.json({
      regulations: formattedRegulations,
      total: formattedRegulations.length,
      limit,
      offset,
    })

  } catch (error) {
    console.error('[Regulations List] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
