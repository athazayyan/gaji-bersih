"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Dummy data - nanti akan diganti dengan data dari backend
const dummyHistoryData = [
  {
    id: 1,
    title: "Kontrak Kerja PT. Teknologi Maju",
    date: "2025-01-15",
    type: "Analisis Dokumen",
    status: "completed",
    salary: "Rp 8.500.000",
    icon: "document",
  },
  {
    id: 2,
    title: "Offer Letter Startup Digital",
    date: "2025-01-10",
    type: "Konsultasi AI",
    status: "completed",
    salary: "Rp 12.000.000",
    icon: "chat",
  },
  {
    id: 3,
    title: "Revisi Kontrak Q1 2025",
    date: "2024-12-28",
    type: "Analisis Dokumen",
    status: "completed",
    salary: "Rp 9.200.000",
    icon: "document",
  },
];

export default function HistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [historyData] = useState(dummyHistoryData);

  // Filter berdasarkan search query
  const filteredHistory = historyData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const handleHistoryClick = (id: number) => {
    // Navigate to detail page
    router.push(`/history/${id}`);
  };

  return (
    <div className="min-h-screen bg-white pb-24 overflow-x-hidden">
      {/* Header Section with Gradient */}
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
          {/* Title */}
          <h1
            className="text-white font-bold mb-2"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "28px",
              lineHeight: "1.2",
            }}
          >
            Riwayat Analisis
          </h1>

          {/* Description */}
          <p
            className="text-white opacity-90"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              lineHeight: "1.4",
            }}
          >
            Lihat kembali hasil analisis dokumen Anda sebelumnya
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pt-5">
        <div className="max-w-md mx-auto">
          {/* Search Bar */}
          <div className="mb-5">
            <div
              className="relative"
              style={{
                filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
              }}
            >
              <input
                type="text"
                placeholder="Cari riwayat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-gray-200 rounded-2xl px-5 py-4 pl-12 focus:outline-none focus:border-hijauterang transition-colors"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                }}
              />
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="mb-5">
            <div
              className="bg-gradient-hijau p-4 rounded-2xl"
              style={{
                filter: "drop-shadow(0px 4px 12px rgba(33, 56, 19, 0.15))",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className="text-white font-bold mb-1"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "18px",
                    }}
                  >
                    {filteredHistory.length} Riwayat
                  </h3>
                  <p
                    className="text-white opacity-90"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "11px",
                    }}
                  >
                    Total dokumen yang dianalisis
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
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
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* History List or Empty State */}
          {filteredHistory.length > 0 ? (
            <div className="space-y-3 mb-6">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleHistoryClick(item.id)}
                  className="bg-white border-2 border-gray-100 rounded-2xl p-4 hover:border-hijauterang transition-all duration-300 active:scale-98 cursor-pointer"
                  style={{
                    filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.06))",
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 rounded-xl p-3"
                      style={{
                        backgroundColor:
                          item.icon === "document" ? "#E5F4E5" : "#E0F2FE",
                      }}
                    >
                      {item.icon === "document" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#4A7C59"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0284C7"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-hijautua font-semibold mb-1 truncate"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "15px",
                        }}
                      >
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor:
                              item.type === "Analisis Dokumen"
                                ? "#E5F4E5"
                                : "#FEF3C7",
                            color:
                              item.type === "Analisis Dokumen"
                                ? "#4A7C59"
                                : "#92400E",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          {item.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-gray-500 text-xs"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {formatDate(item.date)}
                        </span>
                        <span
                          className="text-hijauterang font-semibold text-sm"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {item.salary}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0">
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
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12 px-6">
              <div
                className="bg-gradient-to-br from-gray-50 to-green-50 rounded-3xl p-8 mb-6"
                style={{
                  filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
                }}
              >
                <div className="bg-white rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#CBD5E0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3
                  className="text-hijautua font-bold mb-2"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "20px",
                  }}
                >
                  {searchQuery ? "Tidak Ditemukan" : "Belum Ada Riwayat"}
                </h3>
                <p
                  className="text-gray-600 mb-6"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "13px",
                    lineHeight: "1.6",
                  }}
                >
                  {searchQuery
                    ? `Tidak ada riwayat yang cocok dengan "${searchQuery}"`
                    : "Mulai analisis dokumen pertama Anda untuk melihat riwayat di sini"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => router.push("/home")}
                    className="bg-gradient-hijau text-white font-semibold py-3 px-8 rounded-2xl hover:opacity-90 transition-all active:scale-98"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      filter: "drop-shadow(0px 4px 12px rgba(33, 56, 19, 0.2))",
                    }}
                  >
                    Mulai Analisis
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
