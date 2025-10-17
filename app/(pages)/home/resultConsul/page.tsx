"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AlertCard, { AlertLevel } from "@/app/components/AlertCard";
import AnalysisDetailCard from "@/app/components/AnalysisDetailCard";
import GradientCard from "@/app/components/GradientCard";

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
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden">
      {/* Header Section with Gradient - Same as resultDocument */}
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

      {/* Content Section */}
      <div className="px-6 pt-5">
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
