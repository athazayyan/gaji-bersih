/**
 * Migration Script: Add doc_type attribute to existing regulations
 * 
 * This script updates all existing files in GLOBAL_STORE to have
 * doc_type: "regulation" attribute, allowing the OR filter to work properly.
 * 
 * Run this once to fix existing regulations:
 * npx tsx scripts/migrate-regulation-attributes.ts
 */

import { openai } from '../lib/openai/client'
import { createClient } from '@supabase/supabase-js'

const GLOBAL_STORE = process.env.OPENAI_GLOBAL_VECTOR_STORE_ID!
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function main() {
  console.log('\n📋 Migrating regulation attributes...\n')
  console.log('GLOBAL_STORE:', GLOBAL_STORE)

  // Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // Get all regulations from database
  const { data: regulations, error } = await (supabase
    .from('regulations') as any)
    .select('id, title, file_id, vs_file_id, regulation_type, regulation_number, regulation_year')

  if (error) {
    console.error('❌ Error fetching regulations:', error)
    return
  }

  if (!regulations || regulations.length === 0) {
    console.log('⚠️  No regulations found in database')
    return
  }

  console.log(`Found ${regulations.length} regulations to update\n`)

  let updated = 0
  let failed = 0

  for (const reg of regulations) {
    try {
      console.log(`Updating: ${reg.title}`)
      console.log(`  File ID: ${reg.vs_file_id}`)

      // Update attributes via API
      const response = await fetch(
        `https://api.openai.com/v1/vector_stores/${GLOBAL_STORE}/files/${reg.vs_file_id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            attributes: {
              doc_type: 'regulation',  // CRITICAL attribute for OR filter
              regulation_type: reg.regulation_type,
              regulation_number: reg.regulation_number,
              regulation_year: reg.regulation_year.toString(),
              title: reg.title,
              source: 'admin',
            }
          })
        }
      )

      if (response.ok) {
        console.log(`  ✅ Updated successfully`)
        updated++
      } else {
        const errorData = await response.json()
        console.error(`  ❌ Failed:`, errorData)
        failed++
      }
    } catch (error: any) {
      console.error(`  ❌ Error:`, error.message)
      failed++
    }
    
    console.log()
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Migration Summary')
  console.log('='.repeat(50))
  console.log(`Total regulations: ${regulations.length}`)
  console.log(`Successfully updated: ${updated} ✅`)
  console.log(`Failed: ${failed} ❌`)
  console.log()

  if (updated === regulations.length) {
    console.log('🎉 All regulations migrated successfully!')
  } else {
    console.log('⚠️  Some regulations failed to migrate. Please review the errors above.')
  }
}

main().catch(console.error)
