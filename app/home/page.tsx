export default function HomePage() {
  return (
    <div className="min-h-screen pb-24 px-4 pt-8 bg-white">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-hijautua mb-2">
          Selamat Datang di GajiBersih
        </h1>
        <p className="text-gray-600 mb-6">
          Platform AI untuk memahami kontrak kerja dan menghitung gaji bersih
          Anda
        </p>

        <div className="space-y-4">
          {/* Feature Cards */}
          <div className="bg-gradient-hijau rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Analisis Kontrak</h2>
            <p className="text-sm opacity-90">
              Unggah kontrak kerja Anda dan dapatkan analisis otomatis tentang
              pasal-pasal yang perlu diperhatikan
            </p>
          </div>

          <div className="bg-white border-2 border-hijaumuda rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2 text-hijautua">
              Kalkulator Gaji
            </h2>
            <p className="text-sm text-gray-600">
              Hitung gaji bersih Anda dengan simulasi PPh21 & BPJS yang akurat
            </p>
          </div>

          <div className="bg-white border-2 border-hijaumuda rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2 text-hijautua">
              Konsultasi AI
            </h2>
            <p className="text-sm text-gray-600">
              Tanyakan pertanyaan seputar hak pekerja dan kontrak kerja Anda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
