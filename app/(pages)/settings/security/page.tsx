"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HorizontalNavbar from "@/app/components/HorizontalNavbar";

export default function SecurityPage() {
  const router = useRouter();
  const [twoFactor, setTwoFactor] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
              Keamanan
            </h1>
          </div>
        </div>

        <div className="px-6 pt-5">
          <div className="max-w-md mx-auto space-y-5">
            {/* Change Password Card */}
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
                Ubah Password
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2 text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Password Saat Ini
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-hijauterang"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                    <button
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {showCurrentPassword ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2 text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-hijauterang"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {showNewPassword ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  className="w-full bg-gradient-hijau text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Ubah Password
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div
              className="bg-white rounded-2xl p-5 border-2 border-gray-100"
              style={{
                filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3
                    className="text-hijautua font-semibold mb-1"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "16px",
                    }}
                  >
                    Autentikasi Dua Faktor
                  </h3>
                  <p
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Tingkatkan keamanan akun Anda
                  </p>
                </div>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    twoFactor ? "bg-hijauterang" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      twoFactor ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Login History */}
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
                Riwayat Login
              </h3>
              <div className="space-y-3">
                {["Chrome - Windows", "Mobile - Android", "Safari - MacOS"].map(
                  (device, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p
                          className="text-hijautua font-medium text-sm"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {device}
                        </p>
                        <p
                          className="text-gray-500 text-xs"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {index === 0
                            ? "Aktif sekarang"
                            : `${index + 1} hari yang lalu`}
                        </p>
                      </div>
                      {index !== 0 && (
                        <button className="text-red-500 text-sm font-medium">
                          Logout
                        </button>
                      )}
                    </div>
                  )
                )}
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
              Keamanan
            </h1>

            <div className="grid grid-cols-2 gap-8">
              {/* Change Password */}
              <div className="col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
                <h3
                  className="text-hijautua font-semibold text-xl mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Ubah Password
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-hijautua font-medium mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Password Saat Ini
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-hijauterang"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      />
                      <button
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {showCurrentPassword ? (
                            <>
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </>
                          ) : (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-hijautua font-medium mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-hijauterang"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {showNewPassword ? (
                            <>
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </>
                          ) : (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button
                    className="w-full bg-gradient-hijau text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Ubah Password
                  </button>
                </div>
              </div>

              {/* Two-Factor */}
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-hijautua font-semibold text-lg"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Autentikasi 2FA
                  </h3>
                  <button
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      twoFactor ? "bg-hijauterang" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                        twoFactor ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <p
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Tingkatkan keamanan dengan autentikasi dua faktor
                </p>
              </div>

              {/* Login History */}
              <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                <h3
                  className="text-hijautua font-semibold text-lg mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Riwayat Login
                </h3>
                <div className="space-y-2">
                  {["Chrome", "Mobile", "Safari"].map((device, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white rounded-lg"
                    >
                      <span
                        className="text-sm text-hijautua font-medium"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {device}
                      </span>
                      {index === 0 && (
                        <span
                          className="text-xs text-green-600 font-semibold"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Aktif
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
