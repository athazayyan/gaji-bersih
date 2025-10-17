"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionCard from "@/app/components/QuestionCard";
import Notification from "@/app/components/Notification";

// Data pertanyaan rekomendasi berdasarkan analisis
const recommendedQuestions = [
  {
    id: 1,
    question:
      "Apakah ada batas maksimal denda keterlambatan yang diperbolehkan menurut kebijakan perusahaan?",
    category: "Denda & Sanksi",
    priority: "high" as const,
  },
  {
    id: 2,
    question:
      "Bagaimana mekanisme perhitungan denda keterlambatan? Apakah ada toleransi waktu?",
    category: "Denda & Sanksi",
    priority: "high" as const,
  },
  {
    id: 3,
    question:
      "Apakah kebijakan denda ini sudah sesuai dengan peraturan ketenagakerjaan yang berlaku?",
    category: "Legalitas",
    priority: "high" as const,
  },
  {
    id: 4,
    question:
      "Bisakah saya mendapatkan salinan lengkap dari peraturan perusahaan terkait sanksi?",
    category: "Dokumentasi",
    priority: "medium" as const,
  },
  {
    id: 5,
    question:
      "Apakah ada prosedur banding jika saya merasa denda yang diberikan tidak adil?",
    category: "Hak Karyawan",
    priority: "medium" as const,
  },
  {
    id: 6,
    question:
      "Dalam kondisi darurat atau force majeure, apakah masih berlaku kebijakan denda ini?",
    category: "Pengecualian",
    priority: "low" as const,
  },
  {
    id: 7,
    question:
      "Apakah ada program konseling atau peringatan sebelum denda diterapkan?",
    category: "Prosedur",
    priority: "low" as const,
  },
];

type FilterType = "all" | "high" | "medium" | "low";

const filterConfig = {
  all: { label: "Semua", color: "#4A7C59", bgColor: "#E5F4E5" },
  high: { label: "Penting", color: "#FF4444", bgColor: "#FFE5E5" },
  medium: { label: "Perlu", color: "#FFB800", bgColor: "#FFF4E5" },
  low: { label: "Opsional", color: "#4CAF50", bgColor: "#E5F4E5" },
};

export default function QuestionsHRPage() {
  const router = useRouter();
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [showNotification, setShowNotification] = useState(false);

  const filteredQuestions = recommendedQuestions.filter((q) => {
    if (activeFilter === "all") return true;
    return q.priority === activeFilter;
  });

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleSaveQuestions = () => {
    const selected = recommendedQuestions.filter((q) =>
      selectedQuestions.includes(q.id)
    );

    // Simpan ke localStorage
    localStorage.setItem("savedQuestions", JSON.stringify(selected));

    // Tampilkan notifikasi
    setShowNotification(true);

    // Kembali ke halaman sebelumnya setelah delay
    setTimeout(() => {
      router.back();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-gray-50 lg:via-green-50/30 lg:to-emerald-50/40 pb-20 overflow-x-hidden relative">
      {/* Desktop Background Decorations */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-hijauterang/20 to-hijaumuda/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-hijautua/10 to-hijauterang/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-green-100/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Header Section with Gradient */}
      <div
        className="bg-gradient-hijau relative lg:hidden"
        style={{
          width: "100%",
          maxWidth: "414px",
          height: "180px",
          borderRadius: "0 0 30px 30px",
          margin: "0 auto",
        }}
      >
        <div className="px-6 pt-12 pb-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
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
              fontSize: "22px",
              lineHeight: "1.2",
            }}
          >
            Pertanyaan untuk HR
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
            Rekomendasi pertanyaan berdasarkan analisis dokumen Anda
          </p>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block lg:max-w-[1400px] lg:mx-auto lg:px-8 lg:py-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.back()}
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
                Kembali
              </span>
            </button>

            <h1
              className="text-hijautua font-bold text-4xl mb-3"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Pertanyaan untuk HR
            </h1>
            <p
              className="text-gray-600 text-base"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Pilih pertanyaan yang ingin Anda tanyakan berdasarkan analisis
              dokumen
            </p>
          </div>

          {/* Desktop Quick Action */}
          {selectedQuestions.length > 0 && (
            <button
              onClick={handleSaveQuestions}
              className="bg-gradient-hijau text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Simpan {selectedQuestions.length} Pertanyaan
            </button>
          )}
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <Notification
          message={`${selectedQuestions.length} pertanyaan berhasil disimpan!`}
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Desktop 2-Column Layout */}
      <div className="hidden lg:block lg:max-w-[1400px] lg:mx-auto lg:px-8 lg:pb-12 relative z-10">
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT Sidebar - Filter & Stats */}
          <div className="col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Filter Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <h2
                  className="text-hijautua font-semibold text-xl mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Filter Prioritas
                </h2>
                <div className="space-y-3">
                  {(Object.keys(filterConfig) as FilterType[]).map((filter) => {
                    const config = filterConfig[filter];
                    const isActive = activeFilter === filter;
                    const count =
                      filter === "all"
                        ? recommendedQuestions.length
                        : recommendedQuestions.filter(
                            (q) => q.priority === filter
                          ).length;

                    return (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className="w-full px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-between hover:scale-[1.02]"
                        style={{
                          backgroundColor: isActive
                            ? config.color
                            : config.bgColor,
                          color: isActive ? "white" : config.color,
                          border: `2px solid ${config.color}`,
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "14px",
                        }}
                      >
                        <span className="font-semibold">{config.label}</span>
                        <span
                          className="px-3 py-1 rounded-full text-sm font-bold min-w-[32px] text-center"
                          style={{
                            backgroundColor: isActive
                              ? "rgba(255,255,255,0.3)"
                              : config.color,
                            color: "white",
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-gradient-hijau rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  </div>
                  <h3
                    className="text-white font-bold text-3xl mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {selectedQuestions.length}
                  </h3>
                  <p
                    className="text-white/90 text-sm mb-3"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Pertanyaan Dipilih
                  </p>
                  <div className="border-t border-white/30 pt-3 mt-3">
                    <p
                      className="text-white/80 text-xs"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Menampilkan {filteredQuestions.length} dari{" "}
                      {recommendedQuestions.length} pertanyaan
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/50 p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-lg p-2 flex-shrink-0">
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
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div>
                    <h4
                      className="text-blue-900 font-semibold text-sm mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Tips
                    </h4>
                    <p
                      className="text-blue-700 text-xs leading-relaxed"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Pilih pertanyaan yang paling relevan dengan situasi Anda.
                      Pertanyaan dengan prioritas tinggi sangat
                      direkomendasikan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT Content - Questions Grid */}
          <div className="col-span-8">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-hijautua font-semibold text-2xl"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Daftar Pertanyaan
                </h2>
                <span
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {filteredQuestions.length} pertanyaan tersedia
                </span>
              </div>

              {/* Questions Grid */}
              <div className="grid grid-cols-1 gap-4">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className={`transition-all duration-300 ${
                      selectedQuestions.includes(question.id)
                        ? "ring-2 ring-hijautua ring-opacity-50 scale-[1.01]"
                        : "hover:scale-[1.005]"
                    } rounded-2xl`}
                  >
                    <QuestionCard
                      question={question.question}
                      category={question.category}
                      priority={question.priority}
                      onClick={() => handleQuestionSelect(question.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredQuestions.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <p
                    className="text-gray-500 text-lg"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Tidak ada pertanyaan dengan filter ini
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Content Section */}
      <div className="px-6 pt-5 lg:hidden">
        <div className="max-w-md mx-auto">
          {/* Filter Section */}
          <div className="mb-5">
            <h2
              className="text-hijautua font-semibold mb-3 text-center"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
              }}
            >
              Filter Prioritas
            </h2>
            <div className="flex gap-2 flex-wrap justify-center">
              {(Object.keys(filterConfig) as FilterType[]).map((filter) => {
                const config = filterConfig[filter];
                const isActive = activeFilter === filter;
                const count =
                  filter === "all"
                    ? recommendedQuestions.length
                    : recommendedQuestions.filter((q) => q.priority === filter)
                        .length;

                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className="px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2"
                    style={{
                      backgroundColor: isActive ? config.color : config.bgColor,
                      color: isActive ? "white" : config.color,
                      border: `2px solid ${config.color}`,
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "12px",
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {config.label}
                    <span
                      className="px-2 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.3)"
                          : config.color,
                        color: "white",
                        minWidth: "20px",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button - Moved to top for better UX */}
          {selectedQuestions.length > 0 && (
            <div className="mb-5">
              <button
                onClick={handleSaveQuestions}
                className="w-full bg-gradient-hijau text-white font-semibold py-4 rounded-2xl hover:opacity-90 transition-all active:scale-98"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "18px",
                  filter: "drop-shadow(0px 6px 16px rgba(33, 56, 19, 0.2))",
                }}
              >
                Simpan {selectedQuestions.length} Pertanyaan
              </button>
            </div>
          )}

          {/* Stats Section */}
          <div className="mb-5">
            <div
              className="bg-gradient-hijau p-4 rounded-2xl"
              style={{
                filter: "drop-shadow(0px 4px 12px rgba(33, 56, 19, 0.15))",
              }}
            >
              <div className="text-center">
                <h3
                  className="text-white font-bold mb-1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "18px",
                  }}
                >
                  {selectedQuestions.length} Pertanyaan Dipilih
                </h3>
                <p
                  className="text-white opacity-90"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "12px",
                  }}
                >
                  Menampilkan {filteredQuestions.length} dari{" "}
                  {recommendedQuestions.length} pertanyaan
                </p>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="mb-6 space-y-4">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className={`${
                  selectedQuestions.includes(question.id)
                    ? "ring-2 ring-hijautua ring-opacity-50"
                    : ""
                } rounded-2xl`}
              >
                <QuestionCard
                  question={question.question}
                  category={question.category}
                  priority={question.priority}
                  onClick={() => handleQuestionSelect(question.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
