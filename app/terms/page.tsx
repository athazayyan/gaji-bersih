import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-hijau">
      {/* Header Section */}
      <div className="px-6 py-8 md:px-12 lg:px-20">
        <h1><a href="/auth">← back</a></h1>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Syarat dan Ketentuan Penggunaan
          </h1>
          <p className="text-white/80 text-sm md:text-base mb-2">
            Terakhir diperbarui: <span className="font-semibold">Oktober 2025</span>
          </p>
        </div>
      </div>

      {/* Content Section - White Container */}
      <div className="bg-white rounded-t-[40px] px-6 py-10 md:px-12 lg:px-20 min-h-[70vh]">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-hijautua leading-relaxed">
              Selamat datang di <span className="font-semibold">GajiBersih</span> — 
              platform berbasis kecerdasan buatan (AI) yang membantu pekerja dan 
              pencari kerja memahami isi kontrak kerja, menghitung gaji bersih 
              (take-home pay), serta mendeteksi potensi pasal bermasalah (red flag) 
              dalam dokumen ketenagakerjaan.
            </p>
            <p className="text-hijautua leading-relaxed">
              Dengan menggunakan aplikasi ini, Anda dianggap telah membaca, memahami, 
              dan menyetujui Syarat dan Ketentuan berikut.
            </p>
          </section>

          {/* Section 1: Definisi */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-hijautua border-l-4 border-hijauterang pl-4">
              1. Definisi
            </h2>
            <ul className="space-y-3 text-hijautua ml-4">
              <li className="flex gap-3">
                <span className="text-hijauterang font-bold">•</span>
                <span>
                  <strong>"GajiBersih"</strong> adalah aplikasi web dan/atau mobile 
                  yang dikembangkan oleh Tim GajiBersih untuk membantu analisis 
                  kontrak kerja dan simulasi gaji bersih secara otomatis.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-hijauterang font-bold">•</span>
                <span>
                  <strong>"Pengguna"</strong> adalah individu, lembaga, atau entitas 
                  yang menggunakan layanan GajiBersih.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-hijauterang font-bold">•</span>
                <span>
                  <strong>"Layanan"</strong> mencakup fitur analisis dokumen, 
                  kalkulator gaji, tanya jawab AI, ekspor laporan, dan fitur lain 
                  yang disediakan dalam aplikasi.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-hijauterang font-bold">•</span>
                <span>
                  <strong>"Dokumen"</strong> adalah berkas digital yang diunggah 
                  pengguna, seperti kontrak kerja, slip gaji, atau surat penawaran kerja.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 2: Penggunaan Layanan */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-hijautua border-l-4 border-hijauterang pl-4">
              2. Penggunaan Layanan
            </h2>
            <ol className="space-y-3 text-hijautua ml-6 list-decimal">
              <li>
                GajiBersih menyediakan layanan analisis berbasis AI untuk membantu 
                pengguna memahami dokumen ketenagakerjaan.
              </li>
              <li>
                Pengguna wajib menggunakan layanan secara sah, wajar, dan tidak 
                bertentangan dengan hukum.
              </li>
              <li>
                Hasil analisis bersifat informatif dan tidak menggantikan nasihat 
                hukum profesional.
              </li>
              <li>
                Pengguna bertanggung jawab penuh atas dokumen dan data yang diunggah 
                ke sistem.
              </li>
            </ol>
          </section>

          {/* Section 3: Akun dan Keamanan */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-hijautua border-l-4 border-hijauterang pl-4">
              3. Akun dan Keamanan
            </h2>
            <ol className="space-y-3 text-hijautua ml-6 list-decimal">
              <li>
                Untuk mengakses fitur tertentu, pengguna perlu membuat akun GajiBersih.
              </li>
              <li>Pengguna wajib menjaga kerahasiaan akun dan kata sandi.</li>
              <li>
                Aktivitas yang dilakukan melalui akun dianggap sah sebagai tindakan 
                pengguna.
              </li>
              <li>
                GajiBersih tidak bertanggung jawab atas penyalahgunaan akun akibat 
                kelalaian pengguna.
              </li>
            </ol>
          </section>

          {/* Section 4: Privasi dan Perlindungan Data */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-hijautua border-l-4 border-hijauterang pl-4">
              4. Privasi dan Perlindungan Data
            </h2>
            <ol className="space-y-3 text-hijautua ml-6 list-decimal">
              <li>
                GajiBersih menghormati privasi pengguna dan mematuhi Undang-Undang 
                Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
              </li>
              <li>
                Dokumen yang diunggah akan:
                <ul className="ml-6 mt-2 space-y-2">
                  <li className="flex gap-3">
                    <span className="text-hijauterang">•</span>
                    <span>Diproses dengan enkripsi end-to-end.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-hijauterang">•</span>
                    <span>
                      Dihapus otomatis setelah proses analisis (kecuali pengguna 
                      memilih menyimpannya).
                    </span>
                  </li>
                </ul>
              </li>
              <li>
                GajiBersih tidak menyimpan, menjual, atau membagikan data pribadi 
                pengguna kepada pihak ketiga tanpa izin.
              </li>
              <li>
                Pengguna dapat meminta penghapusan akun dan seluruh datanya kapan saja.
              </li>
            </ol>
          </section>

          {/* Section 5: Model Pembayaran */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-hijautua border-l-4 border-hijauterang pl-4">
              5. Model Pembayaran
            </h2>
            <ol className="space-y-3 text-hijautua ml-6 list-decimal">
              <li>
                Layanan GajiBersih bersifat freemium, di mana pengguna baru mendapat 
                3 kali analisis gratis.
              </li>
              <li>
                Setelah itu, pengguna dapat membeli paket token untuk analisis 
                tambahan dengan harga:
                <ul className="ml-6 mt-2 space-y-2 font-medium">
                  <li className="flex gap-3">
                    <span className="text-hijauterang">•</span>
                    <span>Rp 7.000 → 2 kali penggunaan</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-hijauterang">•</span>
                    <span>Rp 10.000 → 3 kali penggunaan</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-hijauterang">•</span>
                    <span>Rp 20.000 → 7 kali penggunaan</span>
                  </li>
                </ul>
              </li>
              <li>
                Token dapat dibeli melalui metode pembayaran resmi seperti QRIS, 
                e-wallet, atau transfer bank.
              </li>
              <li>Token tidak dapat dikembalikan (non-refundable) setelah digunakan.</li>
            </ol>
          </section>

          {/* Section 6: Batasan Tanggung Jawab */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-hijautua border-l-4 border-hijauterang pl-4">
              6. Batasan Tanggung Jawab
            </h2>
            <ol className="space-y-3 text-hijautua ml-6 list-decimal">
              <li>
                GajiBersih berfungsi sebagai asisten analisis AI, bukan pengacara 
                atau konsultan hukum.
              </li>
              <li>
                Tim tidak bertanggung jawab atas keputusan hukum atau kontraktual 
                yang diambil berdasarkan hasil analisis aplikasi.
              </li>
              <li>
                Meskipun sistem berusaha memberikan hasil yang akurat, GajiBersih 
                tidak menjamin bahwa hasil analisis bebas dari kesalahan atau 
                ketidaktepatan interpretasi hukum.
              </li>
            </ol>
          </section>

          {/* Section 7: Hak Kekayaan Intelektual */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-hijautua border-l-4 border-hijauterang pl-4">
              7. Hak Kekayaan Intelektual
            </h2>
            <ol className="space-y-3 text-hijautua ml-6 list-decimal">
              <li>
                Seluruh logo, merek, desain antarmuka, teks, dan sistem AI yang 
                digunakan dalam GajiBersih merupakan hak milik pengembang.
              </li>
              <li>
                Pengguna dilarang menyalin, mendistribusikan, atau memodifikasi 
                bagian mana pun dari aplikasi tanpa izin tertulis dari pengembang.
              </li>
            </ol>
          </section>

          {/* Section 8: Perubahan Layanan */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-hijautua border-l-4 border-hijauterang pl-4">
              8. Perubahan Layanan
            </h2>
            <ol className="space-y-3 text-hijautua ml-6 list-decimal">
              <li>
                GajiBersih berhak untuk menambah, mengubah, atau menghapus fitur 
                tanpa pemberitahuan sebelumnya.
              </li>
              <li>
                Syarat dan Ketentuan ini dapat diperbarui sewaktu-waktu. Pengguna 
                akan diinformasikan melalui aplikasi atau email.
              </li>
            </ol>
          </section>

          {/* Section 9: Hukum yang Berlaku */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-hijautua border-l-4 border-hijauterang pl-4">
              9. Hukum yang Berlaku
            </h2>
            <p className="text-hijautua leading-relaxed ml-6">
              Syarat dan Ketentuan ini diatur dan ditafsirkan berdasarkan hukum 
              Republik Indonesia. Segala sengketa yang timbul akan diselesaikan 
              secara musyawarah terlebih dahulu, dan bila tidak tercapai kesepakatan, 
              maka akan diselesaikan melalui pengadilan di wilayah hukum Banda Aceh 
              (atau sesuai domisili pengembang).
            </p>
          </section>

          {/* Section 10: Kontak */}
          <section className="space-y-4 bg-hijaumuda/20 p-6 rounded-2xl border-2 border-hijauterang/30">
            <h2 className="text-2xl font-bold text-hijautua border-l-4 border-hijauterang pl-4">
              10. Kontak Kami
            </h2>
            <p className="text-hijautua leading-relaxed ml-6">
              Jika Anda memiliki pertanyaan terkait Syarat dan Ketentuan ini, 
              silakan hubungi:
            </p>
            <div className="ml-6 space-y-2 text-hijautua font-medium">
              <p className="flex items-center gap-2">
                <span className="text-hijauterang">📧</span>
                <a 
                  href="mailto:support@gajibersih.id" 
                  className="hover:text-hijauterang transition-colors"
                >
                  support@gajibersih.id
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-hijauterang">🌐</span>
                <a 
                  href="https://www.gajibersih.id" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-hijauterang transition-colors"
                >
                  www.gajibersih.id
                </a>
              </p>
            </div>
          </section>

          {/* Footer Note */}
          <div className="text-center pt-8 pb-4 border-t border-hijautua/20">
            <p className="text-sm text-hijautua/60">
              © 2025 GajiBersih. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}