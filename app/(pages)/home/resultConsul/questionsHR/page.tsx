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
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden">
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

      {/* Notification */}
      {showNotification && (
        <Notification
          message={`${selectedQuestions.length} pertanyaan berhasil disimpan!`}
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Content Section */}
      <div className="px-6 pt-5">
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
