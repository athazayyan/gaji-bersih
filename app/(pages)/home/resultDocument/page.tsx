"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GradientCard from "@/app/components/GradientCard";

export default function ResultDocumentPage() {
  const router = useRouter();
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("document");
  const [showSalary, setShowSalary] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);

  // Mock data - replace with actual data from backend
  const estimatedSalary = 4850000;

  useEffect(() => {
    // Load file data from localStorage
    const savedFile = localStorage.getItem("uploadedFile");
    const savedFileType = localStorage.getItem("uploadedFileType");
    const savedFileName = localStorage.getItem("uploadedFileName");

    if (savedFile) setFilePreview(savedFile);
    if (savedFileType) setFileType(savedFileType);
    if (savedFileName) setFileName(savedFileName);
  }, []);

  // Scanning progress animation
  useEffect(() => {
    const scanningInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          // Reset scanning animation
          return 0;
        }
        return prev + 1.5;
      });
    }, 80);

    return () => clearInterval(scanningInterval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  return (
    <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-gray-50 lg:via-green-50/30 lg:to-emerald-50/40 pb-6 overflow-x-hidden relative">
      {/* Desktop Background Decorations */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top right circle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-hijauterang/20 to-hijaumuda/10 rounded-full blur-3xl"></div>

        {/* Bottom left circle */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-hijautua/10 to-hijauterang/10 rounded-full blur-3xl"></div>

        {/* Center accent */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-green-100/20 to-transparent rounded-full blur-3xl"></div>

        {/* Floating shapes */}
        <div className="absolute top-20 right-1/4 w-32 h-32 bg-hijauterang/10 rounded-2xl rotate-12 blur-2xl"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-hijaumuda/10 rounded-full blur-2xl"></div>
      </div>

      {/* Desktop Container */}
      <div className="lg:max-w-7xl lg:mx-auto lg:px-8 lg:py-12 relative z-10 lg:min-h-screen lg:flex lg:items-center">
        {/* Desktop Grid Layout */}
        <div className="lg:grid lg:grid-cols-5 lg:gap-8 lg:w-full">
          {/* LEFT: Document Preview - Desktop Only */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 sticky top-8">
              <h2
                className="text-hijautua font-bold text-2xl mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Dokumen Anda
              </h2>

              <div className="flex justify-center">
                <div
                  className="relative"
                  style={{ width: "100%", maxWidth: "380px" }}
                >
                  <div
                    className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-8 bg-white relative">
                      <div className="relative mb-6">
                        <div
                          className="absolute inset-0 bg-white rounded-lg transform rotate-3"
                          style={{
                            width: "160px",
                            height: "220px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                        ></div>
                        <div
                          className="absolute inset-0 bg-white rounded-lg transform -rotate-2"
                          style={{
                            width: "160px",
                            height: "220px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                        ></div>
                        <div
                          className="relative bg-white rounded-lg p-6 flex flex-col items-center justify-center"
                          style={{
                            width: "160px",
                            height: "220px",
                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="70"
                            height="70"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <div
                            className="mt-3 px-3 py-1.5 bg-red-500 text-white rounded font-bold"
                            style={{ fontSize: "11px" }}
                          >
                            PDF
                          </div>
                          <div className="w-full mt-4 space-y-2">
                            <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                            <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                            <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                          </div>
                        </div>
                      </div>
                      <h3
                        className="text-gray-800 font-semibold text-center mb-3 px-4 line-clamp-2"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "14px",
                        }}
                      >
                        {fileName ||
                          "Surat Penawaran - PT Maju Jaya Sejahtera.pdf"}
                      </h3>
                      <div
                        className="flex items-center gap-2 text-green-600 font-medium"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "13px",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Analisis Selesai
                      </div>
                      <div
                        className="absolute left-0 right-0 z-20"
                        style={{
                          top: `${scanProgress}%`,
                          transition: "top 0.1s linear",
                          height: "3px",
                        }}
                      >
                        <div
                          className="absolute left-0 right-0 h-full"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent 0%, #77BF5A 20%, #B0DB9C 50%, #77BF5A 80%, transparent 100%)",
                            boxShadow:
                              "0 0 10px rgba(119, 191, 90, 0.8), 0 0 20px rgba(119, 191, 90, 0.6)",
                          }}
                        ></div>
                      </div>
                      <div
                        className="absolute top-0 left-0 right-0 pointer-events-none"
                        style={{
                          height: `${scanProgress}%`,
                          transition: "height 0.1s linear",
                          background:
                            "linear-gradient(180deg, rgba(119, 191, 90, 0.15) 0%, rgba(177, 219, 156, 0.08) 50%, transparent 100%)",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Results Section */}
          <div className="lg:col-span-3">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h1
                className="text-hijautua font-bold text-4xl mb-3"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Hasil Analisis Dokumen
              </h1>
              <p
                className="text-gray-600 text-base"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Berikut adalah estimasi gaji dan rincian dari dokumen Anda
              </p>
            </div>

            {/* Desktop Bento Grid */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:mb-8">
              {/* Large Salary Card - Spans 2 columns */}
              <div className="lg:col-span-2">
                <div className="relative p-8 text-white w-full bg-gradient-hijau rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p
                        className="text-lg font-normal mb-3 opacity-90"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Estimasi Gaji Bersih per Bulan
                      </p>
                      <h2
                        className="text-6xl font-bold transition-all duration-500"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {showSalary
                          ? `Rp ${formatCurrency(estimatedSalary)}`
                          : "Rp ****"}
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowSalary(!showSalary)}
                      className="text-white transition-transform hover:scale-110 active:scale-95 p-2"
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {showSalary ? (
                          <path
                            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                            fill="white"
                          />
                        ) : (
                          <path
                            d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                            fill="white"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                  <p
                    className="text-sm text-white/90 mt-4"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    *setelah estimasi potongan PPh 21 dan BPJS
                  </p>
                </div>
              </div>

              {/* Salary Details Card */}
              <div className="bg-gradient-hijau rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] p-8 flex flex-col justify-between">
                <div>
                  <h2
                    className="text-white font-semibold italic text-3xl mb-4"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      lineHeight: "1.3",
                    }}
                  >
                    Rincian Gaji &<br />
                    Potongan
                  </h2>
                  <p
                    className="text-white/80 text-sm mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Lihat detail lengkap komponen gaji dan potongan Anda
                  </p>
                </div>
                <button
                  onClick={() =>
                    router.push("/home/resultDocument/salaryDetails")
                  }
                  className="bg-white flex items-center gap-3 transition-all hover:scale-105 hover:shadow-lg rounded-full px-4 py-3"
                >
                  <div className="bg-gradient-hijau rounded-full flex items-center justify-center w-10 h-10 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span
                    className="text-hijautua font-medium text-sm flex-1"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Lihat Rincian
                  </span>
                </button>
              </div>

              {/* Analysis Status Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-green-100 rounded-full p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className="text-hijautua font-semibold text-xl mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Analisis Selesai
                    </h3>
                    <p
                      className="text-gray-600 text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Dokumen Anda telah berhasil dianalisis
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Ekstraksi data gaji
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Perhitungan potongan
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span
                      className="text-gray-700 text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Validasi dokumen
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Analysis Card - Full width */}
              <div className="lg:col-span-2">
                <button
                  onClick={() => router.push("/home/resultConsul")}
                  className="w-full bg-gradient-hijau text-white font-medium rounded-2xl transition-all duration-300 hover:opacity-90 hover:scale-[1.02] hover:shadow-2xl flex items-center justify-between p-6 shadow-xl"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "18px",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white rounded-full flex items-center justify-center w-14 h-14">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#213813"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">
                        Lanjut Analisis Klausul
                      </div>
                      <div className="text-sm text-white/80">
                        Analisis detail kontrak kerja Anda
                      </div>
                    </div>
                  </div>
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
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Header Section with Gradient - Mobile Only */}
            <div
              className="bg-gradient-hijau relative lg:hidden"
              style={{
                width: "100%",
                maxWidth: "414px",
                height: "160px",
                borderRadius: "0 0 30px 30px",
                margin: "0 auto",
              }}
            >
              <div className="px-6 pt-12 pb-6 flex flex-col justify-center h-full">
                {/* Title - Adjusted Size */}
                <h1
                  className="text-white font-bold mb-4"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "22px",
                    lineHeight: "1.2",
                  }}
                >
                  Hasil Analisis Dokumen
                </h1>

                {/* Description */}
                <p
                  className="text-white opacity-90"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    lineHeight: "1.4",
                  }}
                >
                  Untuk dokumen:{" "}
                  {fileName || "Surat Penawaran - PT Maju Jaya Sejahtera.pdf"}
                </p>
              </div>
            </div>

            {/* Content Section - Mobile Only */}
            <div className="px-6 pt-6 lg:hidden">
              <div className="max-w-md mx-auto">
                {/* Document Preview with Scanning Complete Effect - Mobile Only */}
                <div className="mb-6 flex justify-center">
                  <div
                    className="relative"
                    style={{
                      width: "281px",
                      height: "350px",
                    }}
                  >
                    {/* Shadow layer */}
                    <div
                      className="absolute top-0 left-0 right-0 bg-gradient-to-b from-hijauterang/30 to-transparent"
                      style={{
                        height: "60px",
                        borderRadius: "12px 12px 0 0",
                        filter: "blur(8px)",
                        zIndex: 1,
                      }}
                    ></div>

                    {/* Document container with scanning complete */}
                    <div
                      className="relative bg-white rounded-xl overflow-hidden"
                      style={{
                        width: "100%",
                        height: "100%",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                        border: "1px solid #E0E0E0",
                      }}
                    >
                      {/* PDF Document Icon - Same as scanning page with white background */}
                      <div className="flex flex-col items-center justify-center h-full p-6 bg-white relative">
                        <div className="relative mb-4">
                          {/* Document Background Stack */}
                          <div
                            className="absolute inset-0 bg-white rounded-lg transform rotate-3"
                            style={{
                              width: "120px",
                              height: "160px",
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 bg-white rounded-lg transform -rotate-2"
                            style={{
                              width: "120px",
                              height: "160px",
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                          ></div>

                          {/* Main PDF Document */}
                          <div
                            className="relative bg-white rounded-lg p-4 flex flex-col items-center justify-center"
                            style={{
                              width: "120px",
                              height: "160px",
                              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                            }}
                          >
                            {/* PDF Icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="50"
                              height="50"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#EF4444"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <div
                              className="mt-2 px-2.5 py-1 bg-red-500 text-white rounded font-bold"
                              style={{
                                fontSize: "9px",
                              }}
                            >
                              PDF
                            </div>

                            {/* Decorative lines */}
                            <div className="w-full mt-3 space-y-1">
                              <div className="h-1 bg-gray-300 rounded w-full"></div>
                              <div className="h-1 bg-gray-300 rounded w-4/5"></div>
                              <div className="h-1 bg-gray-300 rounded w-full"></div>
                            </div>
                          </div>
                        </div>

                        {/* File Name */}
                        <h3
                          className="text-gray-800 font-semibold text-center mb-2 max-w-[220px] truncate"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "12px",
                          }}
                        >
                          {fileName ||
                            "Surat Penawaran - PT Maju Jaya Sejahtera.pdf"}
                        </h3>

                        {/* Success Badge with Check Icon */}
                        <div
                          className="flex items-center gap-2 text-green-600 font-medium mb-2"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "11px",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Analisis Selesai
                        </div>

                        {/* Green scanning line - Animated */}
                        <div
                          className="absolute left-0 right-0 z-20"
                          style={{
                            top: `${scanProgress}%`,
                            transition: "top 0.1s linear",
                            height: "3px",
                          }}
                        >
                          {/* Main scanning line with intense glow */}
                          <div
                            className="absolute left-0 right-0 h-full"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent 0%, #77BF5A 20%, #B0DB9C 50%, #77BF5A 80%, transparent 100%)",
                              boxShadow: `
                          0 0 10px rgba(119, 191, 90, 0.8),
                          0 0 20px rgba(119, 191, 90, 0.6),
                          0 0 30px rgba(177, 219, 156, 0.5),
                          0 0 40px rgba(177, 219, 156, 0.3)
                        `,
                            }}
                          ></div>

                          {/* Secondary glow layer */}
                          <div
                            className="absolute left-0 right-0 blur-md"
                            style={{
                              top: "-8px",
                              height: "20px",
                              background:
                                "linear-gradient(90deg, transparent 0%, rgba(119, 191, 90, 0.4) 50%, transparent 100%)",
                            }}
                          ></div>

                          {/* Light beam effect */}
                          <div
                            className="absolute left-0 right-0"
                            style={{
                              top: "0",
                              height: "1px",
                              background:
                                "linear-gradient(90deg, transparent 0%, #FFFFFF 50%, transparent 100%)",
                              opacity: 0.6,
                            }}
                          ></div>
                        </div>

                        {/* Scanning Overlay - Enhanced with green tint */}
                        <div
                          className="absolute top-0 left-0 right-0 pointer-events-none"
                          style={{
                            height: `${scanProgress}%`,
                            transition: "height 0.1s linear",
                            background:
                              "linear-gradient(180deg, rgba(119, 191, 90, 0.15) 0%, rgba(177, 219, 156, 0.08) 50%, transparent 100%)",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estimated Salary Card - Using bg-gradient-hijau - Mobile Only */}
                <div className="mb-4">
                  <div
                    className="relative p-6 text-white w-full bg-gradient-hijau"
                    style={{
                      height: "152px",
                      borderRadius: "15px",
                      maxWidth: "365px",
                      margin: "0 auto",
                    }}
                  >
                    <p
                      className="text-sm font-normal mb-2"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Estimasi Gaji Bersih per Bulan
                    </p>
                    <div className="mb-4 flex items-center justify-between">
                      <h2
                        className="text-4xl font-bold transition-all duration-500"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {showSalary
                          ? `RP. ${formatCurrency(estimatedSalary)}`
                          : "RP. ****"}
                      </h2>
                      {/* Hide/Show Salary Button - positioned inline */}
                      <button
                        onClick={() => setShowSalary(!showSalary)}
                        className="text-white ml-4 transition-transform active:scale-95"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {showSalary ? (
                            <path
                              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                              fill="white"
                            />
                          ) : (
                            <path
                              d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                              fill="white"
                            />
                          )}
                        </svg>
                      </button>
                    </div>
                    <p
                      className="text-xs text-white/80"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      *setelah estimasi potongan PPh 21 dan lainnya BPJS
                    </p>
                  </div>
                </div>

                {/* Salary Details Card with Button - Mobile Only */}
                <div className="mb-6">
                  <div
                    className="bg-gradient-hijau flex flex-col justify-between relative"
                    style={{
                      width: "100%",
                      maxWidth: "365px",
                      height: "152px",
                      borderRadius: "15px",
                      padding: "16px",
                      margin: "0 auto",
                    }}
                  >
                    <h2
                      className="text-white font-semibold italic"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "24px",
                        fontWeight: 600,
                        lineHeight: "1.2",
                      }}
                    >
                      Rincian Gaji &<br />
                      Potongan
                    </h2>

                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          router.push("/home/resultDocument/salaryDetails")
                        }
                        className="bg-white flex items-center gap-2 transition-transform hover:scale-105 relative overflow-hidden"
                        style={{
                          minWidth: "180px",
                          height: "36px",
                          borderRadius: "20px",
                          flexShrink: 0,
                          padding: "0 8px 0 4px",
                        }}
                      >
                        <div
                          className="bg-gradient-hijau rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            width: "28px",
                            height: "28px",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                        <span
                          className="text-hijautua font-medium flex-1 text-center whitespace-nowrap"
                          style={{
                            fontSize: "11px",
                            fontFamily: "Poppins, sans-serif",
                            paddingRight: "8px",
                          }}
                        >
                          Lihat rincian
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Next Analysis Button - Mobile Only */}
                <div className="mt-6 mb-4">
                  <button
                    onClick={() => router.push("/home/resultConsul")}
                    className="w-full bg-gradient-hijau text-white font-medium rounded-full transition-all duration-300 hover:opacity-90 hover:scale-105 relative flex items-center justify-between"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "16px",
                      height: "56px",
                      padding: "0 24px",
                    }}
                  >
                    <span className="flex-1 text-center">
                      Lanjut Analisis Klausul
                    </span>

                    {/* Circle with arrow on the left */}
                    <div
                      className="absolute left-4 bg-white rounded-full flex items-center justify-center"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#213813"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
