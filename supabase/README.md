# Supabase Setup Guide

This guide will help you set up the database, storage, and authentication for the Gaji Bersih project.

## Prerequisites

- Supabase project created at https://supabase.com
- Supabase CLI installed (`supabase` is already in devDependencies)
- Project linked to remote: `supabase link --project-ref <your-project-ref>`

## Step 1: Run Database Migrations

The migrations will create all necessary tables, indexes, RLS policies, and scheduled GC jobs.

```bash
# Apply all migrations to your remote database
supabase db push
```

This will run the following migrations in order:
1. **001_create_profiles.sql** - User profiles table with avatar support
2. **002_create_sessions.sql** - Chat sessions with TTL
3. **003_create_documents.sql** - Document metadata tracking
4. **004_create_runs.sql** - Query execution logs
5. **005_create_gc_function.sql** - Garbage collection (runs every 15 min)

### Verify Migrations

After running migrations, verify in Supabase Dashboard:
1. Go to **Database** → **Tables**
2. You should see: `profiles`, `sessions`, `documents`, `runs`, `gc_logs`
3. Go to **Database** → **Functions**
4. You should see: `cleanup_expired_documents_with_logging`, `cleanup_old_gc_logs`
5. Go to **Database** → **Cron Jobs** (if available in your plan)
6. You should see scheduled jobs running

## Step 2: Set Up Storage Buckets

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to Storage in Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/<your-project>/storage/buckets

2. **Create "documents" Bucket**
   - Click **"New bucket"**
   - Name: `documents`
   - Public: **OFF** (private bucket)
   - File size limit: `10 MB` (10485760 bytes)
   - Allowed MIME types:
     ```
     application/pdf
     image/jpeg
     image/jpg
     image/png
     image/webp
     text/plain
     ```
   - Click **"Create bucket"**

3. **Create "avatars" Bucket**
   - Click **"New bucket"**
   - Name: `avatars`
   - Public: **ON** (public bucket for easy avatar access)
   - File size limit: `2 MB` (2097152 bytes)
   - Allowed MIME types:
     ```
     image/jpeg
     image/jpg
     image/png
     image/webp
     ```
   - Click **"Create bucket"**

4. **Apply Storage Policies**
   - Go to **Storage** → **Policies**
   - Click **"New Policy"** for each bucket
   - Or run the SQL from `supabase/storage.sql` in the SQL Editor:

   ```bash
   # Copy contents of storage.sql to SQL Editor and run
   cat supabase/storage.sql
   ```

### Option B: Using SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard
2. Open `supabase/storage.sql` in your text editor
3. Copy the entire contents
4. Paste into SQL Editor and click **"Run"**

This will create both buckets and apply all RLS policies.

## Step 3: Generate TypeScript Types

After migrations are complete, generate TypeScript types from your schema:

```bash
npm run types:generate
```

This will update `lib/database.types.ts` with the latest schema types.

## Step 4: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials from Supabase Dashboard:
   - Go to **Settings** → **API**
   - Copy:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

3. Add your OpenAI credentials:
   - Go to https://platform.openai.com/api-keys
   - Create an API key → `OPENAI_API_KEY`
   - Create vector stores (see below) → `OPENAI_GLOBAL_VECTOR_STORE_ID` and `OPENAI_BIG_VECTOR_STORE_ID`

## Step 5: Create OpenAI Vector Stores

You need to create two vector stores in OpenAI:

### Using OpenAI Dashboard

1. Go to https://platform.openai.com/storage/vector_stores
2. Click **"Create vector store"**

**Global Store** (for regulations):
- Name: `Gaji Bersih - Global Regulations`
- Description: Indonesian labor laws (UU/PP/Permen) - admin managed
- Copy the vector store ID → `OPENAI_GLOBAL_VECTOR_STORE_ID`

**Big Store** (for user documents):
- Name: `Gaji Bersih - User Documents`
- Description: User documents with attribute filtering (user_id, chat_id)
- Copy the vector store ID → `OPENAI_BIG_VECTOR_STORE_ID`

### Using CLI (Alternative)

```bash
# Install OpenAI CLI (optional)
npm install -g openai

# Create global store
openai api vector_stores.create -d '{"name":"Gaji Bersih - Global Regulations"}'

# Create big store
openai api vector_stores.create -d '{"name":"Gaji Bersih - User Documents"}'
```

## Step 6: Enable Supabase Auth Providers

1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Enable the auth providers you want to use:
   - **Email** (with email confirmation)
   - **Google OAuth** (optional)
   - **GitHub OAuth** (optional)

3. Set up OAuth callback URLs:
   - Callback URL: `http://localhost:3000/api/auth/callback` (for local)
   - Production: `https://your-domain.com/api/auth/callback`

## Step 7: Test Your Setup

```bash
# Start the development server
npm run dev
```

### Verify Database Connection

Create a test file `test-db.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'

export async function testConnection() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('profiles').select('count')

  if (error) {
    console.error('❌ Database connection failed:', error)
  } else {
    console.log('✅ Database connected successfully!')
  }
}
```

### Verify Storage

In Supabase Dashboard:
1. Go to **Storage** → **documents**
2. Try uploading a test PDF file
3. Check if RLS policies work (you should need to be authenticated)

## Verification Checklist

- [ ] All migrations applied successfully
- [ ] Tables exist: `profiles`, `sessions`, `documents`, `runs`, `gc_logs`
- [ ] RLS policies are active on all tables
- [ ] Storage buckets created: `documents` (private), `avatars` (public)
- [ ] Storage RLS policies applied
- [ ] Types generated in `lib/database.types.ts`
- [ ] `.env` file created with all credentials
- [ ] OpenAI vector stores created
- [ ] Auth providers enabled
- [ ] Development server starts without errors

## Common Issues

### Migration Failed

```bash
# Reset database (CAREFUL: deletes all data)
supabase db reset

# Re-run migrations
supabase db push
```

### Type Generation Failed

```bash
# Make sure you're logged in and linked
supabase login
supabase link --project-ref <your-project-ref>

# Try again
npm run types:generate
```

### Storage Policies Not Working

- Make sure you're authenticated when testing
- Check RLS is enabled on `storage.objects` table
- Verify policies in **Storage** → **Policies**

### GC Jobs Not Running

- Check if `pg_cron` extension is enabled (may require paid plan)
- View cron jobs: `SELECT * FROM cron.job;`
- Check logs: `SELECT * FROM gc_logs ORDER BY created_at DESC;`

## Useful Commands

```bash
# Check migration status
supabase db diff

# Generate a new migration
supabase migration new migration_name

# Pull remote schema changes
supabase db pull

# Reset local database
supabase db reset

# View database logs
supabase logs db

# Generate types
npm run types:generate
```

## Next Steps

After completing setup:
1. Test user registration and login
2. Upload a test document
3. Create a test chat session
4. Query with the Responses API
5. Verify GC cleanup works (create expired session, wait 15 min)

## Support

If you encounter issues:
1. Check Supabase Dashboard logs
2. Check `gc_logs` table for GC issues
3. Verify all environment variables are set
4. Ensure OpenAI vector stores exist and IDs are correct
