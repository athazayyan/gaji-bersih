# Desktop Auth Layout - GajiBersih

## Struktur Layout Desktop

Untuk membuat halaman auth dengan split-screen (form di kiri, gambar di kanan), tambahkan kode berikut:

### 1. Tambahkan wrapper desktop setelah mobile layout

```tsx
{
  /* Desktop Layout - Hidden di Mobile, Tampil di >= 1024px */
}
<div className="hidden lg:flex min-h-screen">
  {/* Left Side - Form */}
  <div className="w-1/2 bg-white flex items-center justify-center p-12">
    <div className="w-full max-w-md">
      {/* Logo atau Brand */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-hijautua">GajiBersih</h1>
        <p className="text-hijaudaun mt-2">Analisis kontrak kerja dengan AI</p>
      </div>

      {/* Segmented Control */}
      <div className="mb-8">
        <SegmentedControl
          options={tabs}
          selectedIndex={selectedTab}
          onSelectionChange={handleTabChange}
        />
      </div>

      {/* Form Content - Sama seperti mobile tapi tanpa rounded container */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)] pr-4">
        {selectedTab === 0 ? (
          // Login Form (copy dari mobile)
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* ... form fields sama seperti mobile ... */}
          </form>
        ) : (
          // Register Form (copy dari mobile)
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... form fields sama seperti mobile ... */}
          </form>
        )}
      </div>
    </div>
  </div>

  {/* Right Side - Image/Illustration */}
  <div className="w-1/2 bg-gradient-hijau relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center p-12">
      <div className="text-center text-white max-w-lg">
        <h2 className="text-4xl font-bold mb-6">Gabung Bersama GajiBersih</h2>
        <p className="text-lg opacity-90 leading-relaxed mb-8">
          Bersama GajiBersih, setiap keputusan karirmu lebih berarti. Buat akun
          dan jadilah bagian dari gerakan pekerja yang cerdas dan berdaya.
        </p>

        {/* Placeholder untuk gambar ilustrasi */}
        <div className="mt-12 relative">
          {/* Ganti dengan gambar ilustrasi kamu */}
          <div className="w-full h-96 bg-white/10 rounded-3xl backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-32 h-32 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-white/70">Ilustrasi Dokumen Kontrak</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-hijauterang/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-hijaumuda/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  </div>
</div>;
```

### 2. Tips Implementasi

#### a. **Ubah wrapper utama di return():**

```tsx
return (
  <div className="min-h-screen relative overflow-hidden">
    {/* Mobile Layout - Tampil di < 1024px */}
    <div className="lg:hidden min-h-screen relative">
      {/* Kode mobile layout yang sudah ada */}
    </div>

    {/* Desktop Layout - Tampil di >= 1024px */}
    <div className="hidden lg:flex min-h-screen">
      {/* Kode desktop layout baru */}
    </div>
  </div>
);
```

#### b. **Responsiveness Breakpoints:**

- Mobile: `< 1024px` (lg breakpoint)
- Desktop: `>= 1024px`
- Class `lg:hidden` = sembunyi di desktop
- Class `hidden lg:flex` = sembunyi di mobile, flex di desktop

#### c. **Gambar Ilustrasi:**

Letakkan gambar di `/public/images/` lalu ganti placeholder:

```tsx
<img
  src="/images/auth-illustration.png"
  alt="GajiBersih Illustration"
  className="w-full h-auto rounded-3xl shadow-2xl"
/>
```

### 3. Styling yang Sudah Ada

Manfaatkan class gradient yang sudah dibuat:

- `bg-gradient-hijau` - Gradient hijau utama
- `bg-gradient-hijaumuda` - Gradient hijau muda
- `text-hijautua`, `text-hijauterang` - Warna teks
- `bg-hijautua` - Background hijau tua

### 4. Contoh Full Structure

```
┌─────────────────────────────────────────────────┐
│  MOBILE (< 1024px)                               │
│  ┌───────────────────────────────────────────┐  │
│  │ Gradient Background (Full Screen)         │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │ Header Text (Gabung Bersama...)     │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │ White Container (Rounded Top)       │  │  │
│  │  │  - Segmented Control                │  │  │
│  │  │  - Form                             │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  DESKTOP (>= 1024px)                            │
│  ┌──────────────────┬──────────────────────────┐│
│  │ LEFT (50%)       │ RIGHT (50%)              ││
│  │ White BG         │ Gradient BG              ││
│  │                  │                          ││
│  │ ┌─Logo─────────┐ │ ┌─Hero Text───────────┐ ││
│  │ │ GajiBersih   │ │ │ Gabung Bersama...   │ ││
│  │ └──────────────┘ │ │                     │ ││
│  │                  │ │ ┌─Illustration────┐ │ ││
│  │ ┌─Segmented────┐ │ │ │                 │ │ ││
│  │ │ Masuk|Daftar │ │ │ │  [Image/SVG]    │ │ ││
│  │ └──────────────┘ │ │ │                 │ │ ││
│  │                  │ │ └─────────────────┘ │ ││
│  │ ┌─Form─────────┐ │ └─────────────────────┘ ││
│  │ │ [Inputs...]  │ │                          ││
│  │ │              │ │                          ││
│  │ └──────────────┘ │                          ││
│  └──────────────────┴──────────────────────────┘│
└─────────────────────────────────────────────────┘
```

### 5. Next Steps

1. Siapkan gambar ilustrasi (SVG/PNG) dengan ukuran ~800x600px
2. Letakkan di `/public/images/auth-hero.png`
3. Update placeholder image dengan path yang benar
4. Test di berbagai ukuran layar
5. Optional: Tambahkan animasi fade-in untuk desktop layout
