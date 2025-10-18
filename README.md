# 💰 GajiBersih - Analisis Kontrak & Kalkulator Gaji

**GajiBersih** adalah platform berbasis AI yang membantu pekerja Indonesia memahami kontrak kerja dan menghitung gaji bersih dengan mudah dan akurat.

## 🌟 Fitur Utama

### 📄 Analisis Kontrak Kerja

- **Upload & Scan**: Upload dokumen kontrak kerja Anda (PDF, DOCX, TXT)
- **AI Analysis**: Analisis otomatis menggunakan OpenAI untuk menemukan klausul penting
- **Ringkasan Cepat**: Dapatkan ringkasan hak dan kewajiban Anda
- **Deteksi Risiko**: Identifikasi klausul yang perlu perhatian khusus

### 💵 Kalkulator Gaji Bersih

- **Perhitungan Otomatis**: Hitung gaji bersih dari gaji kotor
- **Detail Lengkap**: Breakdown tunjangan dan potongan (BPJS, PPh21, dll)
- **Rincian Transparan**: Lihat detail setiap komponen gaji Anda

### 🤖 AI Assistant (Tanya AI)

- **Chat Interaktif**: Tanyakan apa saja tentang kontrak Anda
- **Konteks-Aware**: AI memahami dokumen yang sudah dianalisis
- **Jawaban Akurat**: Berdasarkan regulasi ketenagakerjaan Indonesia

### 📊 Dashboard & History

- **Riwayat Analisis**: Akses semua dokumen yang pernah dianalisis
- **Management Dokumen**: Kelola dan review hasil analisis kapan saja
- **Export & Share**: Download atau bagikan hasil analisis

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ dan npm/yarn
- Akun Supabase (untuk database & authentication)
- OpenAI API Key (untuk fitur AI)

### Installation

1. **Clone repository**

```bash
git clone https://github.com/athazayyan/gaji-bersih.git
cd gaji-bersih
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup Environment Variables**

Buat file `.env.local` di root project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_VECTOR_STORE_ID=your_vector_store_id
OPENAI_VECTOR_STORE_BIG_ID=your_big_vector_store_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Setup Database**

Jalankan migration Supabase:

```bash
# Pastikan Supabase CLI sudah terinstall
supabase db push
```

5. **Run Development Server**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **UI Components**: Custom components dengan Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **AI/ML**: OpenAI GPT-4 & Embeddings
- **Language**: TypeScript

## 📱 Responsive Design

GajiBersih dioptimalkan untuk semua perangkat:

- 📱 Mobile: Pengalaman native-like dengan bottom navigation
- 💻 Desktop: Interface yang luas dengan sidebar navigation
- 🎨 Adaptive UI: Otomatis menyesuaikan layout per ukuran layar

## 🔐 Security & Privacy

- **End-to-End Encryption**: Data dokumen dienkripsi
- **Secure Storage**: File disimpan di Supabase Storage dengan RLS (Row Level Security)
- **Private by Default**: Setiap user hanya bisa akses data mereka sendiri
- **GDPR Compliant**: Privasi data terjaga sesuai standar internasional

## 📝 License

Copyright © 2025 GajiBersih. All rights reserved.

## 👥 Team

Developed by **Team GajiBersih** untuk membantu pekerja Indonesia membuat keputusan karir yang lebih baik.

---

💚 **Made with love for Indonesian workers**
