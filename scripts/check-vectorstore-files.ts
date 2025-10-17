/**
 * Check Vector Store Files Status
 * 
 * This script checks the status of files in GLOBAL_STORE and BIG_STORE
 */

import OpenAI from 'openai'

const GLOBAL_STORE = process.env.OPENAI_GLOBAL_VECTOR_STORE_ID!
const BIG_STORE = process.env.OPENAI_BIG_VECTOR_STORE_ID!

async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  console.log('\n📊 Checking Vector Store Status...\n')

  // Check GLOBAL_STORE
  console.log('🌐 GLOBAL_STORE:', GLOBAL_STORE)
  try {
    // Use direct API call since SDK might not have vectorStores
    const response = await fetch(`https://api.openai.com/v1/vector_stores/${GLOBAL_STORE}`, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })
    const globalStore = await response.json()
    console.log('  Status:', globalStore.status)
    console.log('  File counts:', globalStore.file_counts)
    
    // List files
    const filesResponse = await fetch(`https://api.openai.com/v1/vector_stores/${GLOBAL_STORE}/files`, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })
    const filesData = await filesResponse.json()
    console.log(`  Files: ${filesData.data?.length || 0} total`)
    
    for (const file of (filesData.data || []).slice(0, 5)) {
      console.log(`    - ${file.id}: status=${file.status}`)
    }
  } catch (error: any) {
    console.error('  Error:', error.message)
  }

  console.log()

  // Check BIG_STORE
  console.log('📦 BIG_STORE:', BIG_STORE)
  try {
    // Use direct API call since SDK might not have vectorStores
    const response = await fetch(`https://api.openai.com/v1/vector_stores/${BIG_STORE}`, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })
    const bigStore = await response.json()
    console.log('  Status:', bigStore.status)
    console.log('  File counts:', bigStore.file_counts)
    
    // List files
    const filesResponse = await fetch(`https://api.openai.com/v1/vector_stores/${BIG_STORE}/files`, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })
    const filesData = await filesResponse.json()
    console.log(`  Files: ${filesData.data?.length || 0} total`)
    
    for (const file of (filesData.data || []).slice(0, 5)) {
      console.log(`    - ${file.id}: status=${file.status}`)
    }
  } catch (error: any) {
    console.error('  Error:', error.message)
  }
}

main()
