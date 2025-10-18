# Analyze Alternative Implementation Guide

## Project Context

**Gaji Bersih** is a B2C Next.js application that analyzes Indonesian employment documents (contracts, payslips, NDAs) using OpenAI's Responses API with RAG (file-search + web-search).

**Tech Stack:**
- Next.js 15.5.6 (App Router)
- TypeScript (strict mode)
- Supabase (Auth + Database + Storage)
- OpenAI Responses API (gpt-4o)
- Tailwind CSS 4

## Current Implementation Overview

### Current Analyze Endpoint: `/api/analyze`

**Location:** `app/api/analyze/route.ts`

**Current Flow:**
```
POST /api/analyze
  ↓
Validates request (chat_id, document_id, analysis_type)
  ↓
Authenticates user via Supabase
  ↓
Calls OpenAI Responses API with:
  - System prompt asking for JSON output
  - JSON schema for structured response
  - file_search tool (user docs + regulations)
  - web_search tool (latest regulations)
  ↓
Parses JSON response (complex structure)
  ↓
Validates and processes:
  - issues[] array
  - salary_calculation object
  - references
  ↓
Returns structured AnalysisResult
```

**Current Prompt Configuration:**
- File: `lib/openai/prompts.ts`
- Function: `getAnalysisSystemPrompt(analysisType)` - Returns Indonesian prompt
- Function: `getAnalysisJSONSchema(analysisType)` - Returns strict JSON schema
- Output: Complex nested JSON with issues, references, salary calculations

**Frontend:**
- File: `app/(pages)/home/scanning/page.tsx`
- Shows scanning animation (5 seconds)
- Currently uses mock/dummy data
- TODO: Integrate with real backend (commented out lines 54-68)

---

## The Problem

1. **Complex JSON Parsing:** The structured JSON response is difficult to parse correctly, causing frequent errors
2. **Hackathon Timeline:** Need quick, reliable solution before deadline
3. **Error-Prone:** Frontend constantly fails when handling nested JSON structure

---

## The Solution: Analyze Alternative Endpoint

### Goal
Create a simplified version of the analyze endpoint that returns **markdown text** instead of JSON, making it trivial to display without parsing errors.

### What Changes
- **Backend:** New endpoint `/api/analyze-alternative`
- **Prompt:** New markdown-based system prompt (no JSON schema)
- **Response:** Plain markdown text (easy to render)
- **Frontend:** Update scanning page to use new endpoint and display markdown + chat input

### What Stays the Same
- User authentication and authorization
- Session validation
- Document ownership checks
- OpenAI Responses API call with file_search + web_search
- Same analysis logic (issues, compliance checks, salary calculations)
- Follow-up chat functionality (already implemented)

---

## Technical Implementation Details

### 1. New Markdown System Prompt

**File to Update:** `lib/openai/prompts.ts`

**Add new function:**
```typescript
export function getAnalysisMarkdownPrompt(analysisType: AnalysisType): string
```

**Prompt Requirements:**
- Same Indonesian language requirement
- Same analysis tasks (find issues, check compliance, calculate salary)
- Same priority for latest regulations (web-search 2024-2025)
- Same critical checks (penalties, UMP/UMK, BPJS, overtime, etc.)
- **Different:** Ask for markdown formatted response instead of JSON

**Suggested Markdown Structure:**
```markdown
# Hasil Analisis [Jenis Dokumen]

## Ringkasan Umum
[Brief overview of document analysis]

## Isu Kritis
### [Issue Title]
**Kategori:** [Category]
**Tingkat Prioritas:** ⚠️ Kritis / ⚡ Penting / ℹ️ Opsional

**Kutipan Kontrak:**
> [Exact quote from contract]

**Penjelasan:**
[AI explanation in simple Indonesian]

**Status Kepatuhan:** [Compliant/Non-compliant/Unclear]
[Compliance details]

**Rekomendasi:**
[Practical advice]

**Referensi Hukum:**
- [Regulation title] - [Article] - [URL if web]
- [Another reference]

---

[Repeat for each issue...]

## Perhitungan Gaji (if payslip)
**Gaji Kotor:** Rp [amount]
**Total Potongan:** Rp [amount]
- BPJS Kesehatan: Rp [amount]
- BPJS Ketenagakerjaan: Rp [amount]
- PPh21: Rp [amount]

**Total Tunjangan:** Rp [amount]
**Gaji Bersih (Take Home Pay):** Rp [amount]

## Metode Pencarian
- ✅ File Search (Peraturan Internal)
- ✅ Web Search (Regulasi Terbaru 2024-2025)
```

---

### 2. New API Endpoint

**File to Create:** `app/api/analyze-alternative/route.ts`

**Based on:** Copy structure from `app/api/analyze/route.ts`

**Key Differences:**
1. Use `getAnalysisMarkdownPrompt()` instead of `getAnalysisSystemPrompt()`
2. **Remove JSON schema** from OpenAI request (no `response_format`)
3. **Skip JSON parsing** - just extract text content from response
4. **Simpler response format:**
   ```typescript
   {
     analysis_id: string
     chat_id: string
     document: { id, name, type, uploaded_at }
     markdown_content: string  // The full markdown response
     metadata: {
       analyzed_at: string
       model_used: string
       search_methods_used: string[]
       tokens_used: number
       processing_time_ms: number
     }
   }
   ```

**Database Changes:**
- You may want to create a new table `analyses_markdown` or add a `content_type` field to existing `analyses` table
- Store markdown content in a `markdown_content` text field
- Or reuse existing `analyses` table and set `issues = []`, store markdown in a new column

**Authentication/Authorization:** Same as current endpoint
- Validate user session
- Check document ownership
- Enforce user_id filtering

**Response Extraction:**
```typescript
// Instead of JSON.parse(content.text), just use:
const markdownContent = content.text
```

---

### 3. Frontend Updates

**File to Update:** `app/(pages)/home/scanning/page.tsx`

**Current State:**
- Lines 54-68: Backend integration commented out (uses setTimeout mock)
- Shows scanning animation for 5 seconds
- On completion, shows confetti and redirects

**What to Change:**

1. **Call the new endpoint:**
   ```typescript
   const response = await fetch('/api/analyze-alternative', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       chat_id: chatId,
       document_id: documentId,
       analysis_type: analysisType
     })
   })

   const data = await response.json()
   ```

2. **Store markdown in state:**
   ```typescript
   const [markdownResult, setMarkdownResult] = useState<string>('')
   ```

3. **Update UI after animation:**
   - Instead of redirecting, show the result on same page
   - Display markdown content (use a markdown renderer like `react-markdown`)
   - Show chat input below for follow-ups

4. **New UI Layout (after scan completes):**
   ```
   ┌─────────────────────────────────────┐
   │  ✅ Analisis Selesai               │
   ├─────────────────────────────────────┤
   │                                     │
   │  [Markdown Content Rendered Here]   │
   │  (scrollable area)                  │
   │                                     │
   ├─────────────────────────────────────┤
   │  💬 Ada pertanyaan lanjutan?        │
   │  [Chat Input Box]            [Send] │
   └─────────────────────────────────────┘
   ```

5. **Install markdown renderer:**
   ```bash
   npm install react-markdown
   ```

6. **Render markdown:**
   ```tsx
   import ReactMarkdown from 'react-markdown'

   <ReactMarkdown>{markdownResult}</ReactMarkdown>
   ```

---

## Implementation Steps

### Step 1: Add Markdown Prompt
- [ ] Open `lib/openai/prompts.ts`
- [ ] Add `getAnalysisMarkdownPrompt(analysisType: AnalysisType)` function
- [ ] Test prompt structure makes sense in Indonesian

### Step 2: Create Alternative Endpoint
- [ ] Create `app/api/analyze-alternative/route.ts`
- [ ] Copy structure from `app/api/analyze/route.ts`
- [ ] Replace prompt function call
- [ ] Remove JSON schema from OpenAI request
- [ ] Simplify response parsing (no JSON.parse)
- [ ] Return simplified response format
- [ ] Test with Postman/curl

### Step 3: Update Frontend
- [ ] Install `react-markdown`: `npm install react-markdown`
- [ ] Open `app/(pages)/home/scanning/page.tsx`
- [ ] Replace mock API call with real `/api/analyze-alternative` call
- [ ] Add state for markdown content
- [ ] Update UI to show markdown result + chat input
- [ ] Test end-to-end flow

### Step 4: (Optional) Database Updates
- [ ] Decide if you want to store markdown results in database
- [ ] Add migration for new column or table if needed
- [ ] Update endpoint to save markdown to DB

---

## File Paths Reference

### Backend Files
- `lib/openai/prompts.ts` - Add new markdown prompt function
- `app/api/analyze/route.ts` - Reference for endpoint structure
- `app/api/analyze-alternative/route.ts` - **NEW FILE TO CREATE**
- `lib/openai/types.ts` - Type definitions (may need new interface)
- `lib/supabase/server.ts` - Supabase server client

### Frontend Files
- `app/(pages)/home/scanning/page.tsx` - Update this file
- `app/lib/api.ts` - May add new API call helper function

### Database
- `supabase/migrations/` - If you add new table/columns

---

## Testing Checklist

- [ ] Markdown prompt returns well-formatted Indonesian text
- [ ] Endpoint validates authentication correctly
- [ ] Endpoint validates session ownership
- [ ] Endpoint validates document ownership
- [ ] OpenAI file_search works with user docs
- [ ] OpenAI web_search returns latest regulations
- [ ] Markdown content is properly formatted
- [ ] Frontend renders markdown correctly
- [ ] Chat input appears below result
- [ ] Follow-up questions work with existing chat flow
- [ ] Error handling works (invalid session, expired docs, etc.)
- [ ] Performance acceptable (similar to current endpoint)

---

## Environment Variables Needed

Same as current setup (already in `.env`):
```bash
OPENAI_API_KEY=your-key
OPENAI_GLOBAL_VECTOR_STORE_ID=vs_xxx
OPENAI_BIG_VECTOR_STORE_ID=vs_xxx
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

---

## Quick Win Tips

1. **Copy & Modify:** Copy `app/api/analyze/route.ts` to `app/api/analyze-alternative/route.ts` and modify instead of starting from scratch

2. **Simple Markdown Prompt:** Don't overthink it - just ask for sections like "## Issues", "## Salary", "## References"

3. **No Database Initially:** For hackathon speed, you can skip saving to database and just return markdown directly to frontend

4. **Use Existing Chat:** The chat follow-up already works - just integrate it below the markdown display

5. **Test in Stages:**
   - First: Test endpoint with Postman
   - Then: Test frontend API call (console.log response)
   - Finally: Test markdown rendering

---

## Expected Timeline (Hackathon Mode)

- **30 min:** Create markdown prompt in `prompts.ts`
- **1 hour:** Create `/api/analyze-alternative` endpoint
- **1 hour:** Update frontend to call endpoint and render markdown
- **30 min:** Testing and bug fixes
- **Total: ~3 hours**

---

## Questions to Consider

1. **Do you want to save markdown results to database?** (Can skip for MVP)
2. **Do you want to support both JSON and markdown endpoints?** (Keep both or replace?)
3. **Should the markdown include all the same details as JSON?** (Or simplified?)
4. **Do you want citation links to be clickable in markdown?** (Use proper markdown link syntax)

---

## Success Criteria

✅ User clicks "Analyze" button
✅ Scanning animation plays
✅ Backend calls OpenAI with markdown prompt
✅ Markdown response received without parsing errors
✅ Frontend displays formatted markdown result
✅ Chat input appears below for follow-ups
✅ User can continue conversation
✅ No JSON parsing errors
✅ Faster implementation than fixing JSON parser

---

## Notes for LLM Assistant

- This is a hackathon project - prioritize speed and simplicity
- The existing `/api/analyze` endpoint can remain for future use
- Focus on getting markdown version working end-to-end
- Don't over-engineer - markdown text is intentionally simpler
- All responses must be in Indonesian (Bahasa Indonesia)
- Maintain existing security (auth, RLS, user isolation)
- Reuse existing OpenAI integration code where possible
