"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";

// Dummy data detail - nanti akan diganti dengan data dari backend berdasarkan ID
const dummyDetailData: { [key: string]: any } = {
  "1": {
    id: 1,
    title: "Kontrak Kerja PT. Teknologi Maju",
    company: "PT. Teknologi Maju Indonesia",
    date: "2025-01-15",
    type: "Analisis Dokumen",
    status: "completed",
    salary: {
      bruto: "Rp 10.000.000",
      bersih: "Rp 8.500.000",
      components: {
        gajiPokok: "Rp 7.000.000",
        tunjanganJabatan: "Rp 2.000.000",
        tunjanganTransport: "Rp 1.000.000",
      },
      deductions: {
        bpjs: "Rp 400.000",
        pph21: "Rp 1.100.000",
      },
    },
    analysis: {
      alertLevel: "warning" as const,
      alertMessage: "Waspada! Ditemukan 1 Klausul Berisiko",
      findings: [
        {
          title: "Denda Keterlambatan",
          risk: "medium",
          description:
            "Klausul denda keterlambatan Rp 100.000 per kejadian perlu diwaspadai dan dikonfirmasi dengan HR.",
        },
      ],
    },
    document: {
      fileName: "Kontrak_PT_Teknologi_Maju.pdf",
      fileSize: "2.4 MB",
      pages: 12,
    },
  },
  "2": {
    id: 2,
    title: "Offer Letter Startup Digital",
    company: "Startup Digital Innovation",
    date: "2025-01-10",
    type: "Konsultasi AI",
    status: "completed",
    salary: {
      bruto: "Rp 15.000.000",
      bersih: "Rp 12.000.000",
      components: {
        gajiPokok: "Rp 10.000.000",
        tunjanganJabatan: "Rp 3.000.000",
        tunjanganKesehatan: "Rp 2.000.000",
      },
      deductions: {
        bpjs: "Rp 600.000",
        pph21: "Rp 2.400.000",
      },
    },
    analysis: {
      alertLevel: "safe" as const,
      alertMessage: "Aman! Tidak Ada Klausul Berisiko",
      findings: [],
    },
    document: {
      fileName: "Offer_Letter_Startup.pdf",
      fileSize: "1.8 MB",
      pages: 8,
    },
  },
  "3": {
    id: 3,
    title: "Revisi Kontrak Q1 2025",
    company: "PT. Maju Bersama",
    date: "2024-12-28",
    type: "Analisis Dokumen",
    status: "completed",
    salary: {
      bruto: "Rp 11.000.000",
      bersih: "Rp 9.200.000",
      components: {
        gajiPokok: "Rp 8.000.000",
        tunjanganJabatan: "Rp 2.000.000",
        tunjanganTransport: "Rp 1.000.000",
      },
      deductions: {
        bpjs: "Rp 500.000",
        pph21: "Rp 1.300.000",
      },
    },
    analysis: {
      alertLevel: "safe" as const,
      alertMessage: "Aman! Kontrak Sesuai Standard",
      findings: [],
    },
    document: {
      fileName: "Kontrak_Revisi_Q1.pdf",
      fileSize: "3.1 MB",
      pages: 15,
    },
  },
};

type AlertLevel = "safe" | "warning" | "danger";

export default function HistoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // Get data berdasarkan ID
  const data = dummyDetailData[id];

  // Jika data tidak ditemukan
  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1
            className="text-hijautua font-bold text-2xl mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Data Tidak Ditemukan
          </h1>
          <p
            className="text-gray-600 mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Riwayat yang Anda cari tidak tersedia
          </p>
          <button
            onClick={() => router.push("/history")}
            className="bg-gradient-hijau text-white px-6 py-3 rounded-xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Kembali ke Riwayat
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const getAlertColor = (level: AlertLevel) => {
    switch (level) {
      case "safe":
        return { bg: "#E5F4E5", border: "#4A7C59", text: "#4A7C59" };
      case "warning":
        return { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" };
      case "danger":
        return { bg: "#FEE2E2", border: "#EF4444", text: "#991B1B" };
    }
  };

  const alertColors = getAlertColor(data.analysis.alertLevel);

  return (
    <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-gray-50 lg:via-green-50/30 lg:to-emerald-50/40 pb-24 lg:pb-8 overflow-x-hidden relative">
      {/* Desktop Background Decorations */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-hijauterang/20 to-hijaumuda/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-hijautua/10 to-hijauterang/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-hijaumuda/10 rounded-full blur-3xl"></div>
      </div>

      {/* Desktop Container */}
      <div className="lg:max-w-[1400px] lg:mx-auto lg:px-8 lg:py-12 relative z-10">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push("/history")}
                className="flex items-center gap-3 mb-4 text-hijautua hover:text-hijauterang transition-colors group"
              >
                <div className="bg-hijautua/10 group-hover:bg-hijautua/20 rounded-full p-2 transition-colors">
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
                </div>
                <span
                  className="font-medium"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kembali ke Riwayat
                </span>
              </button>

              <h1
                className="text-hijautua font-bold text-4xl mb-3"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {data.title}
              </h1>
              <p
                className="text-gray-600 text-base"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {data.company} • {formatDate(data.date)}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-8">
          {/* LEFT Column - Document Info & Alert */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-6">
              {/* Document Info Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-hijau rounded-xl p-3 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span
                      className="text-xs px-3 py-1 rounded-full font-medium inline-block mb-2"
                      style={{
                        backgroundColor:
                          data.type === "Analisis Dokumen"
                            ? "#E5F4E5"
                            : "#FEF3C7",
                        color:
                          data.type === "Analisis Dokumen"
                            ? "#4A7C59"
                            : "#92400E",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {data.type}
                    </span>
                  </div>
                </div>

                <h3
                  className="text-hijautua font-semibold text-sm mb-3"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Informasi Dokumen
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs text-gray-500"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Nama File
                      </p>
                      <p
                        className="text-sm font-semibold text-gray-800 truncate"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {data.document.fileName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-50 rounded-lg p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#A855F7"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                      </div>
                      <div>
                        <p
                          className="text-xs text-gray-500"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Ukuran
                        </p>
                        <p
                          className="text-sm font-semibold text-gray-800"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {data.document.fileSize}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-green-50 rounded-lg p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <line x1="9" y1="3" x2="9" y2="21" />
                        </svg>
                      </div>
                      <div>
                        <p
                          className="text-xs text-gray-500"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Halaman
                        </p>
                        <p
                          className="text-sm font-semibold text-gray-800"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {data.document.pages}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert Card */}
              <div
                className="rounded-2xl p-6 border-2 shadow-xl hover:shadow-2xl transition-all duration-300"
                style={{
                  backgroundColor: alertColors.bg,
                  borderColor: alertColors.border,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  {data.analysis.alertLevel === "safe" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={alertColors.text}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={alertColors.text}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                  <h3
                    className="font-bold text-lg"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      color: alertColors.text,
                    }}
                  >
                    {data.analysis.alertMessage}
                  </h3>
                </div>
                {data.analysis.findings.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {data.analysis.findings.map(
                      (finding: any, index: number) => (
                        <div key={index} className="bg-white/80 rounded-xl p-4">
                          <p
                            className="text-sm font-semibold mb-2"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              color: alertColors.text,
                            }}
                          >
                            {finding.title}
                          </p>
                          <p
                            className="text-xs leading-relaxed"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              color: alertColors.text,
                            }}
                          >
                            {finding.description}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT Column - Salary Details */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Salary Summary Card */}
              <div className="bg-gradient-hijau rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                <h3
                  className="text-white font-semibold text-lg mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Ringkasan Gaji
                </h3>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-4">
                  <p
                    className="text-white/90 text-sm mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Gaji Bersih
                  </p>
                  <p
                    className="text-white font-bold text-4xl"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {data.salary.bersih}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-white/80 text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Gaji Bruto
                  </span>
                  <span
                    className="text-white font-bold text-xl"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {data.salary.bruto}
                  </span>
                </div>
              </div>

              {/* Salary Components */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
                <h3
                  className="text-hijautua font-semibold text-xl mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Komponen Gaji
                </h3>

                {/* Income */}
                <div className="mb-6">
                  <p
                    className="text-xs text-gray-500 mb-4 font-semibold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    PENDAPATAN
                  </p>
                  <div className="space-y-3">
                    {Object.entries(data.salary.components).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-3 bg-green-50/50 rounded-lg"
                        >
                          <span
                            className="text-sm text-gray-700 font-medium"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </span>
                          <span
                            className="text-base font-bold text-hijauterang"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {String(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Deductions */}
                <div className="border-t pt-6">
                  <p
                    className="text-xs text-gray-500 mb-4 font-semibold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    POTONGAN
                  </p>
                  <div className="space-y-3">
                    {Object.entries(data.salary.deductions).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-3 bg-red-50/50 rounded-lg"
                        >
                          <span
                            className="text-sm text-gray-700 font-medium"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {key.toUpperCase()}
                          </span>
                          <span
                            className="text-base font-bold text-red-500"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            - {String(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header Section with Gradient */}
      <div
        className="bg-gradient-hijau relative lg:hidden"
        style={{
          width: "100%",
          maxWidth: "414px",
          height: "200px",
          borderRadius: "0 0 30px 30px",
          margin: "0 auto",
        }}
      >
        <div className="px-6 pt-12 pb-6">
          {/* Back Button */}
          <button
            onClick={() => router.push("/history")}
            className="flex items-center justify-center mb-4 hover:scale-105 transition-transform duration-200"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "white",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#213813"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>

          {/* Title */}
          <h1
            className="text-white font-bold mb-2"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "20px",
              lineHeight: "1.2",
            }}
          >
            Detail Riwayat
          </h1>

          {/* Date */}
          <p
            className="text-white opacity-90"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "11px",
              fontWeight: 500,
            }}
          >
            {formatDate(data.date)}
          </p>
        </div>
      </div>

      {/* Mobile Content Section */}
      <div className="px-6 pt-5 lg:hidden">
        <div className="max-w-md mx-auto space-y-4">
          {/* Document Info Card */}
          <div
            className="bg-white border-2 border-gray-100 rounded-2xl p-5"
            style={{
              filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
            }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-gradient-hijau rounded-xl p-3 flex-shrink-0">
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
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="flex-1">
                <h2
                  className="text-hijautua font-bold text-lg mb-1"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {data.title}
                </h2>
                <p
                  className="text-gray-600 text-sm mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {data.company}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor:
                        data.type === "Analisis Dokumen"
                          ? "#E5F4E5"
                          : "#FEF3C7",
                      color:
                        data.type === "Analisis Dokumen"
                          ? "#4A7C59"
                          : "#92400E",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {data.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Card */}
          <div
            className="rounded-2xl p-5 border-2"
            style={{
              backgroundColor: alertColors.bg,
              borderColor: alertColors.border,
              filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.06))",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              {data.analysis.alertLevel === "safe" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={alertColors.text}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={alertColors.text}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              <h3
                className="font-bold text-base"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  color: alertColors.text,
                }}
              >
                {data.analysis.alertMessage}
              </h3>
            </div>
            {data.analysis.findings.length > 0 && (
              <div className="mt-3 space-y-2">
                {data.analysis.findings.map((finding: any, index: number) => (
                  <div key={index} className="bg-white/70 rounded-xl p-3">
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        color: alertColors.text,
                      }}
                    >
                      {finding.title}
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        color: alertColors.text,
                      }}
                    >
                      {finding.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Salary Summary Card */}
          <div
            className="bg-gradient-hijau rounded-2xl p-5"
            style={{
              filter: "drop-shadow(0px 4px 12px rgba(33, 56, 19, 0.15))",
            }}
          >
            <h3
              className="text-white font-semibold text-sm mb-3"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Ringkasan Gaji
            </h3>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-3">
              <p
                className="text-white/80 text-xs mb-1"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Gaji Bersih
              </p>
              <p
                className="text-white font-bold text-2xl"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {data.salary.bersih}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className="text-white/80 text-xs"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Gaji Bruto
                </span>
                <span
                  className="text-white font-semibold text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {data.salary.bruto}
                </span>
              </div>
            </div>
          </div>

          {/* Salary Components */}
          <div
            className="bg-white border-2 border-gray-100 rounded-2xl p-5"
            style={{
              filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.06))",
            }}
          >
            <h3
              className="text-hijautua font-semibold text-base mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Komponen Gaji
            </h3>

            {/* Income */}
            <div className="mb-4">
              <p
                className="text-xs text-gray-500 mb-2 font-semibold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                PENDAPATAN
              </p>
              <div className="space-y-2">
                {Object.entries(data.salary.components).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span
                      className="text-sm text-gray-700"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </span>
                    <span
                      className="text-sm font-semibold text-hijauterang"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deductions */}
            <div className="border-t pt-4">
              <p
                className="text-xs text-gray-500 mb-2 font-semibold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                POTONGAN
              </p>
              <div className="space-y-2">
                {Object.entries(data.salary.deductions).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span
                      className="text-sm text-gray-700"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {key.toUpperCase()}
                    </span>
                    <span
                      className="text-sm font-semibold text-red-500"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      - {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div
            className="bg-white border-2 border-gray-100 rounded-2xl p-5"
            style={{
              filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.06))",
            }}
          >
            <h3
              className="text-hijautua font-semibold text-base mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Informasi Dokumen
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 rounded-lg p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p
                    className="text-xs text-gray-500"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Nama File
                  </p>
                  <p
                    className="text-sm font-semibold text-gray-800 truncate"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {data.document.fileName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-50 rounded-lg p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p
                    className="text-xs text-gray-500"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Ukuran File
                  </p>
                  <p
                    className="text-sm font-semibold text-gray-800"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {data.document.fileSize}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-50 rounded-lg p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p
                    className="text-xs text-gray-500"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Jumlah Halaman
                  </p>
                  <p
                    className="text-sm font-semibold text-gray-800"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {data.document.pages} halaman
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => router.push("/history")}
            className="w-full bg-gradient-hijau text-white font-semibold py-4 rounded-2xl hover:opacity-90 transition-all active:scale-98"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              filter: "drop-shadow(0px 6px 16px rgba(33, 56, 19, 0.2))",
            }}
          >
            Kembali ke Riwayat
          </button>
        </div>
      </div>
    </div>
  );
}
