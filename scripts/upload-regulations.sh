#!/bin/bash

# Script to upload all regulations from public/peraturan-terkait/ to GLOBAL vector store
# This will upload them to Supabase Storage (regulations/) and OpenAI GLOBAL vector store
#
# Usage: ./scripts/upload-regulations.sh <email> <password>
#   or set ADMIN_EMAIL and ADMIN_PASSWORD environment variables

set -e

API_BASE="http://localhost:3000/api"
REGULATIONS_DIR="public/peraturan-terkait"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Cookie file for session persistence
COOKIE_FILE="/tmp/upload-regulations-cookies-$$.txt"
trap "rm -f $COOKIE_FILE" EXIT

# Get credentials from args or env
EMAIL="${1:-$ADMIN_EMAIL}"
PASSWORD="${2:-$ADMIN_PASSWORD}"

if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
  echo -e "${RED}Error: Email and password required${NC}"
  echo "Usage: $0 <email> <password>"
  echo "   or: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=pass $0"
  exit 1
fi

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Uploading Regulations to GLOBAL Vector Store${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Step 1: Login
echo -e "${YELLOW}Step 1: Signing in as $EMAIL...${NC}"

LOGIN_RESPONSE=$(curl -s -c "$COOKIE_FILE" -b "$COOKIE_FILE" -X POST "$API_BASE/auth/signin" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.session.access_token' 2>/dev/null)

if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}❌ Login failed. Check credentials.${NC}"
  echo "$LOGIN_RESPONSE" | jq '.'
  exit 1
fi

echo -e "${GREEN}✅ Login successful${NC}"
echo ""

# Step 2: Promote to admin
echo -e "${YELLOW}Step 2: Promoting user to admin...${NC}"
PROMOTE_RESPONSE=$(curl -s -c "$COOKIE_FILE" -b "$COOKIE_FILE" -X POST "$API_BASE/admin/promote")

PROMOTE_MESSAGE=$(echo "$PROMOTE_RESPONSE" | jq -r '.message // .error' 2>/dev/null)

if [[ "$PROMOTE_MESSAGE" == *"promoted to admin"* ]] || [[ "$PROMOTE_MESSAGE" == *"already admin"* ]]; then
  echo -e "${GREEN}✅ User is now admin${NC}"
else
  echo -e "${YELLOW}⚠️  Promotion response: $PROMOTE_MESSAGE${NC}"
fi
echo ""

# Step 3: Upload all regulations
echo -e "${YELLOW}Step 3: Uploading regulations...${NC}"
echo ""

TOTAL=0
SUCCESS=0
FAILED=0

# Define regulations metadata (filename -> metadata)
declare -A REGULATIONS

# UU (Undang-Undang)
REGULATIONS["UU-Nomor-13-Tahun-2003.pdf"]="uu|13|2003|UU No. 13 Tahun 2003 tentang Ketenagakerjaan"
REGULATIONS["UU-Nomor-27-Tahun-2022.pdf"]="uu|27|2022|UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi"
REGULATIONS["UU-Nomor-6-Tahun-2023.pdf"]="uu|6|2023|UU No. 6 Tahun 2023 tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang"

# PP (Peraturan Pemerintah)
REGULATIONS["PP-Nomor-6-Tahun-2025.pdf"]="pp|6|2025|PP No. 6 Tahun 2025 tentang Pengupahan"
REGULATIONS["Peraturan-Pemerintah-Nomor-36-Tahun-2025.pdf"]="pp|36|2025|PP No. 36 Tahun 2025 tentang Upah Minimum"

# Permenaker (Peraturan Menteri Ketenagakerjaan)
REGULATIONS["permenaker-no-1-tahun-2025.pdf"]="permen|1|2025|Permenaker No. 1 Tahun 2025 tentang Tata Cara Penetapan Upah Minimum"
REGULATIONS["permenaker-no-5-tahun-2025.pdf"]="permen|5|2025|Permenaker No. 5 Tahun 2025 tentang Waktu Kerja dan Istirahat"
REGULATIONS["Permenaker-Nomor-16-Tahun-2024.pdf"]="permen|16|2024|Permenaker No. 16 Tahun 2024 tentang Keselamatan dan Kesehatan Kerja"

# Perpres (Peraturan Presiden)
REGULATIONS["Perpres-Nomor-63-Tahun-2022.pdf"]="perpres|63|2022|Perpres No. 63 Tahun 2022 tentang Perlindungan Pekerja Migran Indonesia"

# BPJS
REGULATIONS["peraturan-bpjs-ketenagakerjaan-no-1-tahun-2025.pdf"]="permen|1|2025|Peraturan BPJS Ketenagakerjaan No. 1 Tahun 2025"

# PMK (Peraturan Menteri Keuangan)
REGULATIONS["2025pmkeuangan10.pdf"]="permen|10|2025|PMK No. 10 Tahun 2025 tentang Pajak Penghasilan"

# Other
REGULATIONS["Kesimpulan.docx"]="other|1|2025|Kesimpulan - Ringkasan Peraturan Ketenagakerjaan"

# Upload each regulation
for filename in "${!REGULATIONS[@]}"; do
  TOTAL=$((TOTAL + 1))

  FILE_PATH="$REGULATIONS_DIR/$filename"

  if [ ! -f "$FILE_PATH" ]; then
    echo -e "${RED}❌ File not found: $filename${NC}"
    FAILED=$((FAILED + 1))
    continue
  fi

  # Parse metadata
  IFS='|' read -r reg_type reg_number reg_year reg_title <<< "${REGULATIONS[$filename]}"

  echo -e "${BLUE}[$TOTAL] Uploading: $filename${NC}"
  echo -e "    Type: $reg_type | Number: $reg_number | Year: $reg_year"
  echo -e "    Title: $reg_title"

  # Upload regulation
  UPLOAD_RESPONSE=$(curl -s -c "$COOKIE_FILE" -b "$COOKIE_FILE" -X POST "$API_BASE/admin/regulations/upload" \
    -F "file=@$FILE_PATH" \
    -F "regulation_type=$reg_type" \
    -F "regulation_number=$reg_number" \
    -F "regulation_year=$reg_year" \
    -F "title=$reg_title")

  REGULATION_ID=$(echo "$UPLOAD_RESPONSE" | jq -r '.regulation.id' 2>/dev/null)
  ERROR_MSG=$(echo "$UPLOAD_RESPONSE" | jq -r '.error' 2>/dev/null)

  if [ "$REGULATION_ID" != "null" ] && [ -n "$REGULATION_ID" ]; then
    VS_FILE_ID=$(echo "$UPLOAD_RESPONSE" | jq -r '.regulation.vs_file_id' 2>/dev/null)
    echo -e "    ${GREEN}✅ Success${NC}"
    echo -e "       Regulation ID: $REGULATION_ID"
    echo -e "       Vector Store File ID: $VS_FILE_ID"
    SUCCESS=$((SUCCESS + 1))
  elif [ "$ERROR_MSG" != "null" ] && [[ "$ERROR_MSG" == *"already exists"* ]]; then
    echo -e "    ${YELLOW}⚠️  Already exists (skipped)${NC}"
    SUCCESS=$((SUCCESS + 1))
  else
    echo -e "    ${RED}❌ Failed${NC}"
    echo -e "       Error: $ERROR_MSG"
    echo "$UPLOAD_RESPONSE" | jq '.' 2>/dev/null || echo "$UPLOAD_RESPONSE"
    FAILED=$((FAILED + 1))
  fi

  echo ""
done

# Summary
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Upload Summary${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "Total regulations: $TOTAL"
echo -e "${GREEN}Successfully uploaded: $SUCCESS${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All regulations uploaded successfully!${NC}"
  echo ""
  echo -e "${YELLOW}These regulations are now available in:${NC}"
  echo -e "  1. Supabase Storage: ${BLUE}documents/regulations/${NC}"
  echo -e "  2. OpenAI GLOBAL Vector Store (for file_search)"
  echo -e "  3. Database: ${BLUE}regulations${NC} table"
  echo ""
  echo -e "${YELLOW}You can now use these regulations in document analysis!${NC}"
else
  echo -e "${RED}⚠️  Some uploads failed. Check the errors above.${NC}"
  exit 1
fi
