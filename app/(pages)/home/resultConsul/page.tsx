"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AlertCard, { AlertLevel } from "@/app/components/AlertCard";
import AnalysisDetailCard from "@/app/components/AnalysisDetailCard";
import GradientCard from "@/app/components/GradientCard";
import ChatBot from "@/app/components/ChatBot";

// Dummy data - nanti akan diganti dengan data dari backend AI
const dummyAnalysisData = {
  alertLevel: "warning" as AlertLevel,
  alertMessage: "Waspada! AI Kami Menemukan 1 Klausul Berisiko",
  details: [
    {
      title: "Denda Keterlambatan",
      clauses:
        'Kutipan dari Kontrak: "...keterlambatan kehadiran akan dikenakan sanksi pemotongan gaji sebesar Rp 100.000 per kejadian..."',
      aiExplanation:
        "Klausul ini perlu diwaspadai. Tanyakan kepada HR mengenai dasar hukum dan aturan turunan dari kebijakan denda ini.",
      recommendation:
        "Pastikan kebijakan denda sesuai dengan peraturan ketenagakerjaan yang berlaku. Tanyakan detail mekanisme perhitungan denda dan batas maksimal yang diperbolehkan.",
    },
  ],
};

export default function ConsultPage() {
  const router = useRouter();
  const [savedQuestions, setSavedQuestions] = React.useState<any[]>([]);

  // Load saved questions saat komponen mount
  React.useEffect(() => {
    const saved = localStorage.getItem("savedQuestions");
    if (saved) {
      setSavedQuestions(JSON.parse(saved));
    }
  }, []);

  // Fungsi untuk export PDF (placeholder - akan diimplementasi dengan backend)
  const handleExportPDF = () => {
    console.log("Export to PDF");
    // TODO: Implement PDF export functionality
    alert("Fitur export PDF akan segera tersedia");
  };

  // Fungsi untuk navigasi ke pertanyaan HR
  const handleQuestionHR = () => {
    router.push("/home/resultConsul/questionsHR");
  };

  return (
    <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-gray-50 lg:via-green-50/30 lg:to-emerald-50/40 pb-20 overflow-x-hidden relative">
      {/* Desktop Background Decorations */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top right circle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-hijauterang/20 to-hijaumuda/10 rounded-full blur-3xl"></div>

        {/* Bottom left circle */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-hijautua/10 to-hijauterang/10 rounded-full blur-3xl"></div>

        {/* Center accent */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-green-100/20 to-transparent rounded-full blur-3xl"></div>

        {/* Floating shapes */}
        <div className="absolute top-20 right-1/4 w-32 h-32 bg-hijauterang/10 rounded-2xl rotate-12 blur-2xl"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-hijaumuda/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-hijaumuda/10 rounded-full blur-2xl"></div>
      </div>

      {/* Desktop Container */}
      <div className="lg:max-w-[1600px] lg:mx-auto lg:px-8 lg:py-12 relative z-10">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <div className="flex items-center justify-between">
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
                Hasil Analisis Konsul
              </h1>
              <p
                className="text-gray-600 text-base"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Analisis mendalam terhadap klausul dokumen Anda dengan AI
              </p>
            </div>

            {/* Quick Actions Desktop */}
            <div className="flex gap-3">
              <button
                onClick={handleExportPDF}
                className="bg-white/80 backdrop-blur-sm border border-hijautua text-hijautua px-6 py-3 rounded-xl hover:bg-hijautua hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Simpan PDF
              </button>
              <button
                onClick={() => router.push("/home")}
                className="bg-gradient-hijau text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>

        {/* Desktop 3-Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
          {/* LEFT Column - Alert & Analysis Details */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              {/* Alert Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <AlertCard
                  level={dummyAnalysisData.alertLevel}
                  message={dummyAnalysisData.alertMessage}
                />
              </div>

              {/* Analysis Details */}
              <div className="space-y-4">
                <h2
                  className="text-hijautua font-semibold text-xl"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Detail Analisis Klausul
                </h2>
                {dummyAnalysisData.details.map((detail, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                  >
                    <AnalysisDetailCard
                      title={detail.title}
                      clauses={detail.clauses}
                      aiExplanation={detail.aiExplanation}
                      recommendation={detail.recommendation}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE Column - Saved Questions */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Saved Questions Section */}
              {savedQuestions.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      className="text-hijautua font-semibold text-xl"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Pertanyaan untuk HR
                    </h2>
                    <span
                      className="bg-gradient-hijau text-white px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {savedQuestions.length} pertanyaan
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {savedQuestions.map((question, index) => (
                      <div
                        key={question.id}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span
                            className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                            style={{
                              backgroundColor:
                                question.priority === "high"
                                  ? "#FF4444"
                                  : question.priority === "medium"
                                  ? "#FFB800"
                                  : "#4CAF50",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            {question.priority === "high"
                              ? "Penting"
                              : question.priority === "medium"
                              ? "Perlu"
                              : "Opsional"}
                          </span>
                          <span
                            className="text-xs text-hijautua font-medium bg-white px-2 py-1 rounded-full"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {question.category}
                          </span>
                        </div>
                        <p
                          className="text-hijautua text-sm"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            lineHeight: "1.5",
                          }}
                        >
                          {question.question}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleQuestionHR}
                    className="w-full mt-4 bg-gradient-hijau text-white py-3 rounded-xl hover:opacity-90 transition-all duration-300 font-medium"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Lihat Semua Pertanyaan →
                  </button>
                </div>
              )}

              {/* Action Cards */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <h2
                  className="text-hijautua font-semibold text-xl mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Langkah Selanjutnya
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={handleQuestionHR}
                    className="w-full bg-gradient-hijau text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className="font-semibold text-lg mb-1"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Pertanyaan HR
                        </h3>
                        <p
                          className="text-sm text-white/80"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Tanyakan langsung ke HR
                        </p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  <button
                    onClick={handleExportPDF}
                    className="w-full bg-gradient-hijau text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className="font-semibold text-lg mb-1"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Simpan Hasil
                        </h3>
                        <p
                          className="text-sm text-white/80"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Export ke PDF
                        </p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
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
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT Column - ChatBot */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-hijau p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
                  <h2
                    className="text-hijautua font-semibold text-xl"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    AI Assistant
                  </h2>
                </div>
                <p
                  className="text-gray-600 text-sm mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Tanyakan apa saja tentang kontrak kerja Anda
                </p>
                <ChatBot />
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
            Hasil Analisis Konsul
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
            Analisis mendalam terhadap klausul dokumen Anda
          </p>
        </div>
      </div>

      {/* Mobile Content Section */}
      <div className="px-6 pt-5 lg:hidden">
        <div className="max-w-md mx-auto">
          {/* Alert Card with modern shadow */}
          <div
            className="mb-5"
            style={{
              filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
            }}
          >
            <AlertCard
              level={dummyAnalysisData.alertLevel}
              message={dummyAnalysisData.alertMessage}
            />
          </div>

          {/* Analysis Details with spacing */}
          <div className="mb-6 space-y-4">
            {dummyAnalysisData.details.map((detail, index) => (
              <div
                key={index}
                style={{
                  filter: "drop-shadow(0px 4px 16px rgba(33, 56, 19, 0.1))",
                }}
              >
                <AnalysisDetailCard
                  title={detail.title}
                  clauses={detail.clauses}
                  aiExplanation={detail.aiExplanation}
                  recommendation={detail.recommendation}
                />
              </div>
            ))}
          </div>

          {/* Saved Questions Section */}
          {savedQuestions.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-hijautua font-semibold mb-3"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                }}
              >
                Pertanyaan yang Disimpan ({savedQuestions.length})
              </h2>
              <div
                className="bg-gradient-hijau p-4 rounded-2xl"
                style={{
                  filter: "drop-shadow(0px 4px 12px rgba(33, 56, 19, 0.15))",
                }}
              >
                <div className="space-y-3">
                  {savedQuestions.slice(0, 3).map((question, index) => (
                    <div
                      key={question.id}
                      className="bg-white bg-opacity-95 p-3 rounded-xl"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                          style={{
                            backgroundColor:
                              question.priority === "high"
                                ? "#FF4444"
                                : question.priority === "medium"
                                ? "#FFB800"
                                : "#4CAF50",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          {question.priority === "high"
                            ? "Penting"
                            : question.priority === "medium"
                            ? "Perlu"
                            : "Opsional"}
                        </span>
                        <span
                          className="text-xs text-hijautua opacity-70"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          {question.category}
                        </span>
                      </div>
                      <p
                        className="text-hijautua text-sm"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          lineHeight: "1.4",
                        }}
                      >
                        {question.question}
                      </p>
                    </div>
                  ))}
                  {savedQuestions.length > 3 && (
                    <div className="text-center">
                      <button
                        onClick={handleQuestionHR}
                        className="text-white text-sm font-medium hover:opacity-80 transition-opacity"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Lihat {savedQuestions.length - 3} pertanyaan lainnya →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ChatBot Section */}
          <div className="mb-6">
            <h2
              className="text-hijautua font-semibold mb-3"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
              }}
            >
              Tanya AI Assistant
            </h2>
            <ChatBot />
          </div>

          {/* Action Cards Section with Title */}
          <div className="mb-6">
            <h2
              className="text-hijautua font-semibold mb-3"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
              }}
            >
              Langkah Selanjutnya
            </h2>
            <div className="flex gap-3">
              {/* Pertanyaan HR Card */}
              <div
                className="flex-1"
                style={{
                  filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
                }}
              >
                <GradientCard
                  title="Pertanyaan HR"
                  buttonText="Tanyakan"
                  onClick={handleQuestionHR}
                  width="100%"
                  height="152px"
                  titleSize="18px"
                  isSmallCard={true}
                />
              </div>

              {/* Simpan Hasil Analisis Card */}
              <div
                className="flex-1"
                style={{
                  filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
                }}
              >
                <GradientCard
                  title="Simpan Hasil Analisis"
                  buttonText="Simpan"
                  onClick={handleExportPDF}
                  width="100%"
                  height="152px"
                  titleSize="18px"
                  isSmallCard={true}
                />
              </div>
            </div>
          </div>

          {/* Selesai Button with modern styling */}
          <button
            onClick={() => router.push("/home")}
            className="w-full bg-gradient-hijau text-white font-semibold py-4 rounded-2xl hover:opacity-90 transition-all active:scale-98"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              filter: "drop-shadow(0px 6px 16px rgba(33, 56, 19, 0.2))",
            }}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
