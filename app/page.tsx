"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TestimoniSection } from "./components/Testimoni";
import { useScrollAnimation } from "./hooks/useScrollAnimation";

function landingpage() {
  const router = useRouter();
  const [showVideo, setShowVideo] = React.useState(false);
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  // Scroll animations
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const featuresAnimation = useScrollAnimation({ threshold: 0.1 });
  const ctaAnimation = useScrollAnimation({ threshold: 0.2 });

  // const faqs = [
  //   {
  //     question: "Apa yang bisa GajiBersih lakukan?",
  //     answer:
  //       "GajiBersih membantu Anda memahami kontrak kerja dan menghitung gaji bersih dengan sekali unggah dokumen.",
  //   },
  //   {
  //     question: "Bagaimana cara kerja analisis kontrak?",
  //     answer:
  //       "Unggah dokumen kontrak Anda, AI kami akan menganalisis klausul penting, hak dan kewajiban, serta memberikan ringkasan yang mudah dipahami.",
  //   },
  //   {
  //     question: "Apakah data saya aman?",
  //     answer:
  //       "Ya, semua data dienkripsi dan disimpan dengan aman. Kami tidak membagikan informasi pribadi Anda kepada pihak ketiga.",
  //   },
  //   {
  //     question: "Berapa biaya layanan ini?",
  //     answer:
  //       "Kami menawarkan paket gratis untuk fitur dasar dan paket premium untuk analisis mendalam dan konsultasi HR.",
  //   },
  //   {
  //     question: "Bagaimana cara menghubungi customer support?",
  //     answer:
  //       "Anda dapat menghubungi kami melalui email di support@gajibersih.id atau melalui chat di aplikasi.",
  //   },
  // ];

  return (
    <div className="  text-hijaudaun  overflow-hidden border-t-2 border-green-700 ">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2f9e74_0%,transparent_70%)] opacity-60"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center bg-gradient justify-between px-20 py-6 ">
        <div className="relative flex items-center space-x-2 ">
          <img src="icon/icon-notext.svg" alt="" className="w-15" />
          <h1 className="text-2xl font-bold text-hijau-daun">GajiBersih</h1>
        </div>
        <button
          onClick={() => router.push("/auth")}
          className="bg-hijautua text-white px-6 py-2.5 rounded-full hover:bg-opacity-90 transition font-medium"
        >
          Masuk
        </button>
      </header>

      {/* Hero Section */}
      <section
        ref={heroAnimation.ref}
        className={`relative flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 transition-all duration-1000 ease-out ${
          heroAnimation.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-sm uppercase tracking-wider text-hijautua opacity-70 mb-4">
          Baca, Pahami, Baru Sepakati
        </p>

        <div className=" p-4 max-w-7xl  mx-auto relative  w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-7xl font-bold text-center text-transparent text-gradient-hijau ">
            Analisis
            <br /> Kontrak Kerja Anda
          </h1>
          <p className="mt-4 font-normal max-w-lg text-center mx-auto">
            Kami membantu kontrak kerja & hitung gaji bersihmu dengan sekali
            unggah
          </p>
        </div>

        <div className="relative max-w-3xl w-full">
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <img
              src="/landingpage/footage.png"
              alt="Demo GajiBersih"
              className="w-full cursor-pointer hover:opacity-95 transition"
              onClick={() => setShowVideo(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
          </div>
          <button
            onClick={() => setShowVideo(true)}
            className="absolute left-1/2 bottom-8 -translate-x-1/2 bg-white text-hijautua px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition shadow-lg hover:scale-105 duration-300"
          >
            ▶ Nonton di sini
          </button>
        </div>

        <div className="mt-16 text-sm text-hijautua opacity-60">
          Dipercaya oleh ribuan pekerja Indonesia
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresAnimation.ref}
        className={`relative z-10 px-6 py-20 bg-gradient-hijau flex flex-col items-center justify-center rounded-t-4xl text-white overflow-hidden transition-all duration-1000 ease-out ${
          featuresAnimation.isVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
      >
        <h1 className="text-4xl font-bold text-center mb-12">Overview</h1>
        <p className="text-center text-lg opacity-90 max-w-3xl mx-auto mb-16">
          GajiBersih membantu Anda memahami kontrak kerja dan menghitung gaji
          bersih dengan mudah dan cepat
        </p>

        {/* Mockup utama */}
        <div className="relative">
          <img
            src="landingpage/appfootage.png"
            alt="Tampilan Aplikasi GajiBersih"
            className="max-w-3xl w-full h-auto rounded-2xl shadow-2xl border border-white/20"
          />

          {/* Sticky Notes */}
          <img
            src="landingpage/sticky1.png"
            alt="Sticky Note 1"
            className="absolute -left-20 top-10 w-40 rotate-[-8deg] drop-shadow-lg hover:scale-105 transition-transform "
          />
          <img
            src="landingpage/sticky2.png"
            alt="Sticky Note 2"
            className="absolute -right-20 top-16 w-40 rotate-[10deg] drop-shadow-lg hover:scale-105 transition-transform "
          />
          <img
            src="landingpage/sticky3.png"
            alt="Sticky Note 3"
            className="absolute -left-16 bottom-10 w-44 rotate-[5deg] drop-shadow-lg hover:scale-105 transition-transform -slow"
          />
          <img
            src="landingpage/sticky4.png"
            alt="Sticky Note 4"
            className="absolute -right-16 bottom-10 w-44 rotate-[-5deg] drop-shadow-lg hover:scale-105 transition-transform "
          />
        </div>
      </section>

      {/* AI Assistant Section
      <section className="relative z-10 bg-hijaubiru py-24 px-6  ">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Asisten pribadi Anda
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Dengan AI GajiBersih, Anda dapat menemukan jawaban paling relevan
              untuk pertanyaan tentang kontrak dan gaji Anda
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-3xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 bg-gray-100 rounded-full px-6 py-4 flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-gray-500">
                  Temukan email atau dokumen paling urgent...
                </span>
              </div>
              <button className="bg-hijautua  p-4 rounded-full hover:bg-opacity-90 transition">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>

            <div className="flex space-x-3">
              {["Kontrak", "Gaji", "Pajak", "BPJS"].map((tag) => (
                <button
                  key={tag}
                  className="px-4 py-2 rounded-full bg-gray-100 text-hijautua text-sm hover:bg-gray-200 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* FAQ Section
      <section className="relative z-10 px-6 py-20 bg-hijaubiru">
        <h2 className="text-4xl font-bold text-center mb-4">FAQ</h2>
        <p className="text-center text-hijautua opacity-70 mb-12">
          Pertanyaan yang sering ditanyakan
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedFaq(expandedFaq === index ? null : index)
                }
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <span className="font-medium text-hijautua">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-hijautua transition-transform ${
                    expandedFaq === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedFaq === index && (
                <div className="px-6 pb-5 text-hijautua opacity-70">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section> */}

      {/* Testimonials Section */}
      <TestimoniSection />

      {/* CTA Section */}
      <section
        ref={ctaAnimation.ref}
        className={` z-10 text-amber-50 text-center px-6 py-24 bg-hijaubiru `}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Siap untuk membuat keputusan karir yang lebih baik?
        </h2>
        <p className=" mb-8 max-w-2xl mx-auto">
          Bergabunglah dengan ribuan profesional yang sudah menggunakan
          GajiBersih untuk memahami kontrak dan menghitung gaji mereka.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => router.push("/auth")}
            className="bg-hijaumuda px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl"
          >
            Mulai Gratis
          </button>
          <button className="border-2 border-hijautua px-8 py-4 rounded-full font-semibold hover:bg-hijautua transition-all duration-300 hover:scale-105">
            Pelajari Lebih Lanjut
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 bg-hijaubiru py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
          
            <span className="font-semibold">GajiBersih</span>
          </div>
          <div className="flex space-x-6 text-sm text-hijautua opacity-70">
            <a href="#" className="hover:opacity-100 transition">
              Tentang
            </a>
            <a href="#" className="hover:opacity-100 transition">
              Kebijakan
            </a>
            <a href="#" className="hover:opacity-100 transition">
              Kontak
            </a>
            <a href="/terms" className="hover:opacity-100 transition">
              Syarat & Ketentuan
            </a>
          </div>
          <div className="text-sm text-hijautua opacity-50">
            © 2025 GajiBersih
          </div>
        </div>
      </footer>

      {showVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-10 right-0  text-2xl hover:text-gray-300"
            >
              ✕
            </button>
            <video
              src="/landingpage/landingpage.mp4"
              controls
              autoPlay
              loop
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default landingpage;
