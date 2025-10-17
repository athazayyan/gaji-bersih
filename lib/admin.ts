/**
 * Admin Helper Functions
 * 
 * Utilities for admin authorization and operations
 */

import { createClient } from '@/lib/supabase/server'
import { User } from '@supabase/supabase-js'

/**
 * Check if a user has admin role
 */
export async function isAdmin(user: User): Promise<boolean> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (error || !data) {
      return false
    }
    
    return data.role === 'admin'
  } catch (error) {
    console.error('[isAdmin] Error checking admin status:', error)
    return false
  }
}

/**
 * Middleware to verify admin access
 * Returns user if admin, throws error otherwise
 */
export async function requireAdmin(): Promise<User> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Not authenticated')
  }
  
  // Check if user is admin
  const adminStatus = await isAdmin(user)
  
  if (!adminStatus) {
    throw new Error('Forbidden: Admin access required')
  }
  
  return user
}
