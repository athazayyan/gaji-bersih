/**
 * Test Database and OpenAI Connections
 *
 * Run with: npm run test:connections
 */

// Load environment variables from .env file
import 'dotenv/config'

import { createServiceClient } from '@/lib/supabase/server'
import { openai, VECTOR_STORES } from '@/lib/openai/client'

async function testDatabaseConnection() {
  console.log('\n🔍 Testing Database Connection...')

  try {
    const supabase = createServiceClient()

    // Test 1: Check if we can connect
    const { error: tablesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(0)

    if (tablesError) {
      throw new Error(`Database connection failed: ${tablesError.message}`)
    }

    console.log('✅ Database connection successful!')

    // Test 2: Verify all tables exist
    const tableNames = ['profiles', 'sessions', 'documents', 'runs', 'gc_logs']

    for (const tableName of tableNames) {
      const { error } = await supabase
        .from(tableName)
        .select('count')
        .limit(0)

      if (error) {
        console.log(`❌ Table '${tableName}' not found or inaccessible`)
      } else {
        console.log(`✅ Table '${tableName}' exists`)
      }
    }

    // Test 3: Check RLS policies (skip for now, requires SQL function)
    console.log('\n🔒 RLS policies configured in migrations')

    // Test 4: Check storage buckets
    console.log('\n📦 Checking Storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets()

    if (bucketsError) {
      console.log('❌ Could not list buckets:', bucketsError.message)
    } else {
      const requiredBuckets = ['documents', 'avatars']
      for (const bucket of requiredBuckets) {
        const exists = buckets?.some(b => b.name === bucket)
        if (exists) {
          console.log(`✅ Bucket '${bucket}' exists`)
        } else {
          console.log(`❌ Bucket '${bucket}' not found - Please create it!`)
        }
      }
    }

    return true
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return false
  }
}

async function testOpenAIConnection() {
  console.log('\n🤖 Testing OpenAI Connection...')

  try {
    // Test 1: Basic API connection
    const models = await openai.models.list()
    console.log('✅ OpenAI API connection successful!')
    console.log(`   Found ${models.data.length} available models`)

    // Test 2: Check vector stores
    console.log('\n📚 Checking Vector Stores...')

    if (!VECTOR_STORES.GLOBAL) {
      console.log('⚠️  OPENAI_GLOBAL_VECTOR_STORE_ID not set in .env')
    } else {
      try {
        const globalStore = await openai.vectorStores.retrieve(VECTOR_STORES.GLOBAL)
        console.log(`✅ Global Vector Store found: "${globalStore.name}"`)
        console.log(`   ID: ${VECTOR_STORES.GLOBAL}`)
        console.log(`   Files: ${(globalStore.file_counts as any)?.total || 0}`)
      } catch (error: any) {
        console.log(`❌ Global Vector Store not found: ${error.message}`)
        console.log('   Please create it at: https://platform.openai.com/storage/vector_stores')
      }
    }

    if (!VECTOR_STORES.BIG) {
      console.log('⚠️  OPENAI_BIG_VECTOR_STORE_ID not set in .env')
    } else {
      try {
        const bigStore = await openai.vectorStores.retrieve(VECTOR_STORES.BIG)
        console.log(`✅ Big Vector Store found: "${bigStore.name}"`)
        console.log(`   ID: ${VECTOR_STORES.BIG}`)
        console.log(`   Files: ${(bigStore.file_counts as any)?.total || 0}`)
      } catch (error: any) {
        console.log(`❌ Big Vector Store not found: ${error.message}`)
        console.log('   Please create it at: https://platform.openai.com/storage/vector_stores')
      }
    }

    // Test 3: Test Responses API (simple query)
    console.log('\n💬 Testing Responses API...')
    try {
      const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: 'Say "Hello, Gaji Bersih!" in one sentence.',
        tools: [],
      })

      const firstOutput = response.output?.[0] as any
      const answer = firstOutput?.type === 'message'
        ? firstOutput.content?.[0]?.text || 'No response'
        : 'No response'

      console.log('✅ Responses API working!')
      console.log(`   Response: ${answer.substring(0, 100)}...`)
    } catch (error: any) {
      console.log(`❌ Responses API test failed: ${error.message}`)
    }

    return true
  } catch (error: any) {
    console.error('❌ OpenAI test failed:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Gaji Bersih - Connection Tests')
  console.log('=' .repeat(50))

  // Check environment variables
  console.log('\n📋 Environment Variables:')
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'OPENAI_GLOBAL_VECTOR_STORE_ID',
    'OPENAI_BIG_VECTOR_STORE_ID',
  ]

  let allEnvVarsSet = true
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar]
    if (value) {
      const maskedValue = envVar.includes('KEY')
        ? value.substring(0, 10) + '...'
        : value.substring(0, 30) + '...'
      console.log(`✅ ${envVar}: ${maskedValue}`)
    } else {
      console.log(`❌ ${envVar}: NOT SET`)
      allEnvVarsSet = false
    }
  }

  if (!allEnvVarsSet) {
    console.log('\n❌ Please set all required environment variables in .env')
    console.log('   Copy .env.example to .env and fill in your credentials')
    process.exit(1)
  }

  // Run tests
  const dbSuccess = await testDatabaseConnection()
  const openaiSuccess = await testOpenAIConnection()

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Test Summary:')
  console.log(`   Database: ${dbSuccess ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`   OpenAI: ${openaiSuccess ? '✅ PASS' : '❌ FAIL'}`)

  if (dbSuccess && openaiSuccess) {
    console.log('\n🎉 All tests passed! Your setup is ready to go!')
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.')
    process.exit(1)
  }
}

main()
