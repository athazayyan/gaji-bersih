"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HorizontalNavbar from "@/app/components/HorizontalNavbar";

export default function PrivacyPage() {
  const router = useRouter();
  const [dataCollection, setDataCollection] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

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
              Privasi
            </h1>
          </div>
        </div>

        <div className="px-6 pt-5">
          <div className="max-w-md mx-auto space-y-5">
            {/* Privacy Settings */}
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
                Pengaturan Privasi
              </h3>

              <div className="space-y-4">
                {/* Data Collection */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-3">
                    <h4
                      className="text-hijautua font-medium text-sm mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Pengumpulan Data
                    </h4>
                    <p
                      className="text-gray-500 text-xs"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Izinkan aplikasi mengumpulkan data untuk meningkatkan
                      layanan
                    </p>
                  </div>
                  <button
                    onClick={() => setDataCollection(!dataCollection)}
                    className={`w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                      dataCollection ? "bg-hijauterang" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                        dataCollection ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Analytics */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-3">
                    <h4
                      className="text-hijautua font-medium text-sm mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Analytics
                    </h4>
                    <p
                      className="text-gray-500 text-xs"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Berbagi data penggunaan untuk analisis
                    </p>
                  </div>
                  <button
                    onClick={() => setAnalytics(!analytics)}
                    className={`w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                      analytics ? "bg-hijauterang" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                        analytics ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Marketing */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-3">
                    <h4
                      className="text-hijautua font-medium text-sm mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Marketing
                    </h4>
                    <p
                      className="text-gray-500 text-xs"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Terima informasi promosi dan penawaran
                    </p>
                  </div>
                  <button
                    onClick={() => setMarketing(!marketing)}
                    className={`w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                      marketing ? "bg-hijauterang" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                        marketing ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Data Management */}
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
                Manajemen Data
              </h3>

              <div className="space-y-3">
                <button className="w-full bg-blue-50 text-blue-700 font-medium py-3 px-4 rounded-xl hover:bg-blue-100 transition-all text-left flex items-center justify-between">
                  <span style={{ fontFamily: "Poppins, sans-serif" }}>
                    Download Data Saya
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>

                <button className="w-full bg-red-50 text-red-700 font-medium py-3 px-4 rounded-xl hover:bg-red-100 transition-all text-left flex items-center justify-between">
                  <span style={{ fontFamily: "Poppins, sans-serif" }}>
                    Hapus Semua Data
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
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Privacy Policy */}
            <div
              className="bg-white rounded-2xl p-5 border-2 border-gray-100"
              style={{
                filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
              }}
            >
              <h3
                className="text-hijautua font-semibold mb-3"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px" }}
              >
                Kebijakan & Ketentuan
              </h3>

              <div className="space-y-2">
                <button className="w-full text-left text-hijauterang font-medium text-sm py-2 hover:underline">
                  Kebijakan Privasi
                </button>
                <button className="w-full text-left text-hijauterang font-medium text-sm py-2 hover:underline">
                  Syarat & Ketentuan
                </button>
                <button className="w-full text-left text-hijauterang font-medium text-sm py-2 hover:underline">
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 pt-24 pb-12">
        <div className="max-w-[1000px] mx-auto px-8">
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
              Privasi
            </h1>

            <div className="grid grid-cols-2 gap-8">
              {/* Privacy Settings */}
              <div className="col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
                <h3
                  className="text-hijautua font-semibold text-xl mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Pengaturan Privasi
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                    <div>
                      <h4
                        className="text-hijautua font-semibold mb-1"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Pengumpulan Data
                      </h4>
                      <p
                        className="text-gray-600 text-sm"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Izinkan aplikasi mengumpulkan data untuk meningkatkan
                        layanan
                      </p>
                    </div>
                    <button
                      onClick={() => setDataCollection(!dataCollection)}
                      className={`w-14 h-8 rounded-full transition-colors ${
                        dataCollection ? "bg-hijauterang" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                          dataCollection ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                    <div>
                      <h4
                        className="text-hijautua font-semibold mb-1"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Analytics
                      </h4>
                      <p
                        className="text-gray-600 text-sm"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Berbagi data penggunaan untuk analisis
                      </p>
                    </div>
                    <button
                      onClick={() => setAnalytics(!analytics)}
                      className={`w-14 h-8 rounded-full transition-colors ${
                        analytics ? "bg-hijauterang" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                          analytics ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                    <div>
                      <h4
                        className="text-hijautua font-semibold mb-1"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Marketing
                      </h4>
                      <p
                        className="text-gray-600 text-sm"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Terima informasi promosi dan penawaran
                      </p>
                    </div>
                    <button
                      onClick={() => setMarketing(!marketing)}
                      className={`w-14 h-8 rounded-full transition-colors ${
                        marketing ? "bg-hijauterang" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                          marketing ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3
                  className="text-hijautua font-semibold text-lg mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Manajemen Data
                </h3>

                <div className="space-y-3">
                  <button className="w-full bg-white text-blue-700 font-medium py-3 px-4 rounded-xl hover:bg-blue-100 transition-all flex items-center justify-between">
                    <span style={{ fontFamily: "Poppins, sans-serif" }}>
                      Download Data
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>

                  <button className="w-full bg-white text-red-700 font-medium py-3 px-4 rounded-xl hover:bg-red-50 transition-all flex items-center justify-between">
                    <span style={{ fontFamily: "Poppins, sans-serif" }}>
                      Hapus Data
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
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Policies */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <h3
                  className="text-hijautua font-semibold text-lg mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kebijakan & Ketentuan
                </h3>

                <div className="space-y-3">
                  <button className="w-full bg-white text-hijauterang font-medium py-3 px-4 rounded-xl hover:bg-green-100 transition-all text-left">
                    Kebijakan Privasi →
                  </button>
                  <button className="w-full bg-white text-hijauterang font-medium py-3 px-4 rounded-xl hover:bg-green-100 transition-all text-left">
                    Syarat & Ketentuan →
                  </button>
                  <button className="w-full bg-white text-hijauterang font-medium py-3 px-4 rounded-xl hover:bg-green-100 transition-all text-left">
                    Cookie Policy →
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
