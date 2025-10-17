/**
 * Supabase Client for Client Components
 *
 * Use this client in Client Components (components with "use client" directive).
 * This client handles authentication state and automatically refreshes tokens.
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  // Singleton pattern to reuse the same client instance
  if (client) {
    return client
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}

// Export a default instance for convenience
export const supabase = createClient()
