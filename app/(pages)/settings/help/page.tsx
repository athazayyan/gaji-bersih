"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HorizontalNavbar from "@/app/components/HorizontalNavbar";

export default function HelpPage() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Bagaimana cara menggunakan Gaji Bersih?",
      answer:
        "Upload dokumen kontrak kerja atau surat penawaran Anda, kemudian AI kami akan menganalisis dan memberikan detail gaji bersih serta komponen-komponennya.",
    },
    {
      question: "Apakah data saya aman?",
      answer:
        "Ya, kami menggunakan enkripsi end-to-end dan tidak menyimpan dokumen Anda secara permanen. Semua data diproses dengan standar keamanan tertinggi.",
    },
    {
      question: "Format dokumen apa yang didukung?",
      answer:
        "Saat ini kami mendukung format PDF, DOCX, dan gambar (JPG, PNG). Pastikan dokumen Anda jelas dan terbaca.",
    },
    {
      question: "Berapa lama proses analisis?",
      answer:
        "Analisis biasanya selesai dalam 10-30 detik tergantung kompleksitas dokumen Anda.",
    },
    {
      question: "Bagaimana cara menghubungi support?",
      answer:
        "Anda bisa menghubungi kami melalui email support@gajibersih.com atau chat langsung di aplikasi.",
    },
  ];

  return (
    <>
      <HorizontalNavbar />

      {/* Mobile Layout */}
      <div className="min-h-screen pb-24 bg-white lg:hidden">
        <div
          className="bg-gradient-hijau relative"
          style={{
            width: "100%",
            maxWidth: "414px",
            height: "180px",
            borderRadius: "0 0 30px 30px",
            margin: "0 auto",
          }}
        >
          <div className="px-6 pt-12 pb-6">
            <button
              onClick={() => router.push("/settings")}
              className="mb-4 text-white flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Kembali
            </button>
            <h1
              className="text-white font-bold"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "28px",
              }}
            >
              Bantuan & Dukungan
            </h1>
          </div>
        </div>

        <div className="px-6 pt-5">
          <div className="max-w-md mx-auto space-y-5">
            {/* Contact Support */}
            <div
              className="bg-white rounded-2xl p-5 border-2 border-gray-100"
              style={{
                filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
              }}
            >
              <h3
                className="text-hijautua font-semibold mb-4"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px" }}
              >
                Hubungi Kami
              </h3>

              <div className="space-y-3">
                <button className="w-full bg-blue-50 text-blue-700 font-medium py-3 px-4 rounded-xl hover:bg-blue-100 transition-all text-left flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Email Support
                    </p>
                    <p
                      className="text-xs text-blue-600"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      support@gajibersih.com
                    </p>
                  </div>
                </button>

                <button className="w-full bg-green-50 text-green-700 font-medium py-3 px-4 rounded-xl hover:bg-green-100 transition-all text-left flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Live Chat
                    </p>
                    <p
                      className="text-xs text-green-600"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Chat dengan tim kami
                    </p>
                  </div>
                </button>

                <button className="w-full bg-purple-50 text-purple-700 font-medium py-3 px-4 rounded-xl hover:bg-purple-100 transition-all text-left flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Telepon
                    </p>
                    <p
                      className="text-xs text-purple-600"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      +62 812-3456-7890
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* FAQ */}
            <div
              className="bg-white rounded-2xl p-5 border-2 border-gray-100"
              style={{
                filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
              }}
            >
              <h3
                className="text-hijautua font-semibold mb-4"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px" }}
              >
                Pertanyaan Umum (FAQ)
              </h3>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-100 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === index ? null : index)
                      }
                      className="w-full p-4 text-left flex items-start justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span
                        className="text-hijautua font-medium text-sm pr-2"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {faq.question}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`flex-shrink-0 transition-transform ${
                          expandedFaq === index ? "rotate-180" : ""
                        }`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-4">
                        <p
                          className="text-gray-600 text-sm"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div
              className="bg-white rounded-2xl p-5 border-2 border-gray-100"
              style={{
                filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
              }}
            >
              <h3
                className="text-hijautua font-semibold mb-4"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px" }}
              >
                Sumber Belajar
              </h3>

              <div className="space-y-2">
                <button className="w-full text-left text-hijauterang font-medium text-sm py-2 hover:underline">
                  Panduan Pengguna →
                </button>
                <button className="w-full text-left text-hijauterang font-medium text-sm py-2 hover:underline">
                  Video Tutorial →
                </button>
                <button className="w-full text-left text-hijauterang font-medium text-sm py-2 hover:underline">
                  Blog & Artikel →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 pt-24 pb-12">
        <div className="max-w-[1200px] mx-auto px-8">
          <button
            onClick={() => router.push("/settings")}
            className="mb-6 text-hijautua flex items-center gap-2 hover:text-hijauterang transition-colors"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Kembali ke Pengaturan
          </button>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-10">
            <h1
              className="text-hijautua font-bold text-4xl mb-8"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Bantuan & Dukungan
            </h1>

            <div className="grid grid-cols-3 gap-8 mb-8">
              {/* Contact Cards */}
              <button className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200 hover:scale-105 transition-all text-left">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <h3
                  className="text-blue-900 font-bold text-lg mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Email Support
                </h3>
                <p
                  className="text-blue-700 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  support@gajibersih.com
                </p>
              </button>

              <button className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-200 hover:scale-105 transition-all text-left">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3
                  className="text-green-900 font-bold text-lg mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Live Chat
                </h3>
                <p
                  className="text-green-700 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Chat dengan tim kami
                </p>
              </button>

              <button className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border-2 border-purple-200 hover:scale-105 transition-all text-left">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h3
                  className="text-purple-900 font-bold text-lg mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Telepon
                </h3>
                <p
                  className="text-purple-700 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  +62 812-3456-7890
                </p>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {/* FAQ */}
              <div className="col-span-2 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border-2 border-orange-200">
                <h3
                  className="text-hijautua font-semibold text-2xl mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Pertanyaan Umum (FAQ)
                </h3>

                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl overflow-hidden border-2 border-orange-100"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(expandedFaq === index ? null : index)
                        }
                        className="w-full p-4 text-left flex items-start justify-between hover:bg-orange-50 transition-colors"
                      >
                        <span
                          className="text-hijautua font-semibold pr-4"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {faq.question}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`flex-shrink-0 transition-transform ${
                            expandedFaq === index ? "rotate-180" : ""
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      {expandedFaq === index && (
                        <div className="px-4 pb-4">
                          <p
                            className="text-gray-600"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border-2 border-teal-200">
                <h3
                  className="text-hijautua font-semibold text-xl mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Sumber Belajar
                </h3>

                <div className="space-y-3">
                  <button className="w-full bg-white text-hijauterang font-semibold py-4 px-4 rounded-xl hover:bg-teal-50 transition-all text-left flex items-center justify-between">
                    <span style={{ fontFamily: "Poppins, sans-serif" }}>
                      Panduan Pengguna
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>

                  <button className="w-full bg-white text-hijauterang font-semibold py-4 px-4 rounded-xl hover:bg-teal-50 transition-all text-left flex items-center justify-between">
                    <span style={{ fontFamily: "Poppins, sans-serif" }}>
                      Video Tutorial
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>

                  <button className="w-full bg-white text-hijauterang font-semibold py-4 px-4 rounded-xl hover:bg-teal-50 transition-all text-left flex items-center justify-between">
                    <span style={{ fontFamily: "Poppins, sans-serif" }}>
                      Blog & Artikel
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
