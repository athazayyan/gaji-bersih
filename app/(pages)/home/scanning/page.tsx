"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";

export default function ScanningPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [typingText, setTypingText] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("document");
  const [fileName, setFileName] = useState<string>("");

  // For backend integration
  const [scanningComplete, setScanningComplete] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const fullText = "AI Sedang Bekerja...";
  const completeText = "Analisis Selesai!";
  const errorText = "Terjadi Kesalahan!";

  // Load file from sessionStorage and start analysis
  useEffect(() => {
    const savedFile = sessionStorage.getItem("uploadedFile");
    const savedFileType = sessionStorage.getItem("uploadedFileType");
    const savedFileName = sessionStorage.getItem("uploadedFileName");
    const pendingAnalysisStr = sessionStorage.getItem("pendingAnalysis");

    console.log("Loaded from sessionStorage:", {
      savedFile: savedFile ? `${savedFile.substring(0, 50)}...` : "null",
      savedFileType,
      savedFileName,
      pendingAnalysis: pendingAnalysisStr ? "Found" : "Not found",
    });

    // Set file preview
    if (savedFile) {
      setFilePreview(savedFile);
      console.log("File preview set successfully");
    }

    if (savedFileType) {
      setFileType(savedFileType);
    }

    if (savedFileName) {
      setFileName(savedFileName);
    }

    // Start analysis if pending data exists
    if (pendingAnalysisStr) {
      try {
        const pendingAnalysis = JSON.parse(pendingAnalysisStr);
        console.log("Starting analysis with:", pendingAnalysis);
        startAnalysis(pendingAnalysis);
      } catch (error) {
        console.error("Error parsing pendingAnalysis:", error);
        setAnalysisError("Data analisis tidak valid");
        setScanningComplete(true);
      }
    } else {
      console.error("No pending analysis data found");
      setAnalysisError(
        "Tidak ada data untuk dianalisis. Silakan upload file terlebih dahulu."
      );
      setScanningComplete(true);
    }
  }, []);

  // Start analysis using backend API
  const startAnalysis = async (analysisData: {
    document_id: string;
    chat_id: string;
    file_name: string;
    analysis_type: string;
  }) => {
    try {
      console.log("Calling /api/analyze with:", analysisData);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: analysisData.document_id,
          chat_id: analysisData.chat_id,
          analysis_type: analysisData.analysis_type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || "Gagal menganalisis dokumen"
        );
      }

      const result = await response.json();
      console.log("Analysis result:", result);

      // Store analysis ID and chat_id for navigation
      setAnalysisId(result.analysis_id);

      // Store the COMPLETE backend response (already in correct format)
      // API returns: { analysis_id, chat_id, summary, issues, salary_calculation, ... }
      setAnalysisData(result);
      setScanningComplete(true);

      // Clear pending analysis data
      sessionStorage.removeItem("pendingAnalysis");

      // Trigger confetti animation
      setShowConfetti(true);
      triggerConfetti();
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Gagal menganalisis dokumen. Silakan coba lagi."
      );
      setScanningComplete(true);
    }
  };

  // Typing animation effect
  useEffect(() => {
    if (scanningComplete) {
      if (analysisError) {
        setTypingText(errorText);
      } else {
        setTypingText(completeText);
      }
      return;
    }

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypingText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        // Reset typing animation
        currentIndex = 0;
        setTypingText("");
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, [scanningComplete, analysisError]);

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

  // Note: Removed mock simulation - now using real backend API

  // Confetti animation function
  const triggerConfetti = () => {
    const duration = 3 * 1000; // 3 seconds
    const end = Date.now() + duration;
    const colors = ["#B0DB9C", "#77BF5A", "#213813", "#2F9E74"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      // Clean up object URL if it exists
      if (filePreview && filePreview.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 lg:px-12 xl:px-20 relative overflow-hidden"
      style={{
        background: "var(--gradient-scanning)",
      }}
    >
      {/* Typing Text Animation */}
      <div className="mb-12 lg:mb-12 relative z-10">
        <div className="flex items-center justify-center gap-3 lg:gap-4">
          <h1
            className={`text-white text-center font-bold transition-all duration-500 lg:text-3xl xl:text-4xl ${
              scanningComplete ? "scale-110" : "scale-100"
            }`}
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: scanningComplete ? "28px" : "26px",
              lineHeight: "1.3",
              minHeight: "34px", // Prevent layout shift
              textShadow: scanningComplete
                ? "0 0 30px rgba(177, 219, 156, 0.8), 0 0 50px rgba(177, 219, 156, 0.6)"
                : "0 0 20px rgba(177, 219, 156, 0.6), 0 0 40px rgba(177, 219, 156, 0.4)",
            }}
          >
            {typingText}
            {!scanningComplete && <span className="typing-cursor">|</span>}
          </h1>

          {/* Success/Error Icon - appears beside text when complete */}
          {scanningComplete && !analysisError && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B0DB9C"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce lg:w-9 lg:h-9"
              style={{
                filter: "drop-shadow(0 0 10px rgba(177, 219, 156, 0.8))",
              }}
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="8 12 11 15 16 9" />
            </svg>
          )}
          {scanningComplete && analysisError && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce lg:w-9 lg:h-9"
              style={{
                filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))",
              }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
        </div>
      </div>

      {/* Document Preview with Scanning Animation */}
      <div className="relative mb-12 lg:mb-12 z-10">
        {/* Document Frame with Modern Corner Brackets */}
        <div className="relative">
          {/* Corner Brackets - Enhanced Modern Design */}
          <div className="absolute -inset-5 z-10">
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-10 h-10 lg:w-14 lg:h-14">
              <div
                className="absolute top-0 left-0 w-8 h-1.5 lg:w-11 lg:h-2 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
              <div
                className="absolute top-0 left-0 w-1.5 h-8 lg:w-2 lg:h-11 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
            </div>
            {/* Top Right */}
            <div className="absolute top-0 right-0 w-10 h-10 lg:w-14 lg:h-14">
              <div
                className="absolute top-0 right-0 w-8 h-1.5 lg:w-11 lg:h-2 rounded-full"
                style={{
                  background:
                    "linear-gradient(270deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
              <div
                className="absolute top-0 right-0 w-1.5 h-8 lg:w-2 lg:h-11 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
            </div>
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-10 h-10 lg:w-14 lg:h-14">
              <div
                className="absolute bottom-0 left-0 w-8 h-1.5 lg:w-11 lg:h-2 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-1.5 h-8 lg:w-2 lg:h-11 rounded-full"
                style={{
                  background: "linear-gradient(0deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
            </div>
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-10 h-10 lg:w-14 lg:h-14">
              <div
                className="absolute bottom-0 right-0 w-8 h-1.5 lg:w-11 lg:h-2 rounded-full"
                style={{
                  background:
                    "linear-gradient(270deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
              <div
                className="absolute bottom-0 right-0 w-1.5 h-8 lg:w-2 lg:h-11 rounded-full"
                style={{
                  background: "linear-gradient(0deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
            </div>
          </div>

          {/* Document Container */}
          <div
            className="bg-white rounded-xl overflow-hidden relative lg:w-[400px] lg:h-[560px] lg:rounded-2xl"
            style={{
              width: "300px",
              height: "420px",
              maxWidth: "90vw",
              boxShadow: `
                0 0 40px rgba(177, 219, 156, 0.5),
                0 0 80px rgba(119, 191, 90, 0.3),
                0 20px 50px rgba(0, 0, 0, 0.4),
                inset 0 0 0 1px rgba(177, 219, 156, 0.15)
              `,
            }}
          >
            {/* Document Content - Dynamic based on uploaded file */}
            {(() => {
              console.log("Rendering decision:", {
                hasFilePreview: !!filePreview,
                fileType,
                condition:
                  filePreview && fileType === "image"
                    ? "image"
                    : filePreview && fileType === "pdf"
                    ? "pdf"
                    : "fallback",
              });
              return null;
            })()}

            {filePreview && fileType === "image" ? (
              <div className="h-full overflow-hidden">
                <img
                  src={filePreview}
                  alt="Document Preview"
                  className="w-full h-full object-cover"
                  style={{
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                  onLoad={() => console.log("Image loaded successfully")}
                  onError={(e) => console.error("Image failed to load", e)}
                />
              </div>
            ) : filePreview && fileType === "pdf" ? (
              /* PDF Document - Show styled representation */
              <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-red-50 to-orange-50 relative">
                {/* PDF Icon with Document Style */}
                <div className="relative mb-6">
                  {/* Document Background */}
                  <div
                    className="absolute inset-0 bg-white rounded-lg transform rotate-3"
                    style={{
                      width: "140px",
                      height: "180px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-white rounded-lg transform -rotate-2"
                    style={{
                      width: "140px",
                      height: "180px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  ></div>

                  {/* Main PDF Document */}
                  <div
                    className="relative bg-white rounded-lg p-4 flex flex-col items-center justify-center"
                    style={{
                      width: "140px",
                      height: "180px",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    {/* PDF Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="60"
                      height="60"
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
                      className="mt-3 px-3 py-1 bg-red-500 text-white rounded font-bold"
                      style={{
                        fontSize: "10px",
                      }}
                    >
                      PDF
                    </div>

                    {/* Decorative lines representing text */}
                    <div className="w-full mt-4 space-y-1.5">
                      <div className="h-1 bg-gray-300 rounded w-full"></div>
                      <div className="h-1 bg-gray-300 rounded w-4/5"></div>
                      <div className="h-1 bg-gray-300 rounded w-full"></div>
                    </div>
                  </div>
                </div>

                {/* File Information */}
                <h3
                  className="text-gray-800 font-semibold text-center mb-2 max-w-[250px] truncate"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "13px",
                  }}
                >
                  {fileName}
                </h3>
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
                  File berhasil di-upload
                </div>
                <p
                  className="text-gray-600 text-center"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "11px",
                  }}
                >
                  Sedang dianalisis oleh AI
                </p>
              </div>
            ) : (
              /* Fallback - Document Icon Display */
              <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-6"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <h3
                  className="text-gray-600 font-medium text-center mb-2"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {fileName || "Dokumen Anda"}
                </h3>
                <p
                  className="text-gray-500 text-center"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "11px",
                  }}
                >
                  Sedang dianalisis oleh AI
                </p>
              </div>
            )}

            {/* Scanning Line Animation - Enhanced Glow */}
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

      {/* Bottom Action Button - Only show when complete */}
      {scanningComplete && (
        <div className="w-full max-w-sm lg:max-w-md relative z-10 animate-fade-in">
          {analysisError ? (
            // Error state - show retry button
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p
                  className="text-red-600 text-center text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {analysisError}
                </p>
              </div>
              <button
                onClick={() => router.push("/home/uploadBerkas")}
                className="w-full bg-white text-red-600 font-semibold py-4 lg:py-5 lg:text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  boxShadow:
                    "0 0 20px rgba(239, 68, 68, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)",
                }}
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            // Success state - show view results button
            <button
              onClick={() => {
                // Store full analysis result for resultConsul page
                if (analysisData) {
                  // Store complete backend response (includes chat_id, analysis_id, issues, summary, etc.)
                  sessionStorage.setItem(
                    "currentAnalysisData",
                    JSON.stringify(analysisData)
                  );
                  console.log(
                    "[Navigation] Stored analysis data to sessionStorage:",
                    analysisData
                  );

                  // Store chat_id separately for easy access
                  if (analysisData.chat_id) {
                    sessionStorage.setItem(
                      "currentChatId",
                      analysisData.chat_id
                    );
                    console.log(
                      "[Navigation] Stored chat_id:",
                      analysisData.chat_id
                    );
                  }

                  // Store analysis_id separately
                  if (analysisData.analysis_id) {
                    sessionStorage.setItem(
                      "currentAnalysisId",
                      analysisData.analysis_id
                    );
                    console.log(
                      "[Navigation] Stored analysis_id:",
                      analysisData.analysis_id
                    );
                  }
                } else {
                  console.error(
                    "[Navigation] analysisData is null! Cannot navigate."
                  );
                  return;
                }

                // Navigate to resultConsul page (not resultDocument)
                console.log("[Navigation] Redirecting to /home/resultConsul");
                router.push("/home/resultConsul");
              }}
              className="w-full bg-white text-hijautua font-semibold py-4 lg:py-5 lg:text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
                boxShadow:
                  "0 0 20px rgba(177, 219, 156, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)",
              }}
            >
              Lihat Hasil Konsultasi
            </button>
          )}
        </div>
      )}

      {/* Loading Dots Animation - Only show when scanning */}
      {!scanningComplete && (
        <div className="flex space-x-3 lg:space-x-4 mt-8 lg:mt-10 relative z-10">
          <div
            className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full animate-bounce"
            style={{
              animationDelay: "0ms",
              background: "#B0DB9C",
              boxShadow: "0 0 10px rgba(177, 219, 156, 0.6)",
            }}
          ></div>
          <div
            className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full animate-bounce"
            style={{
              animationDelay: "150ms",
              background: "#B0DB9C",
              boxShadow: "0 0 10px rgba(177, 219, 156, 0.6)",
            }}
          ></div>
          <div
            className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full animate-bounce"
            style={{
              animationDelay: "300ms",
              background: "#B0DB9C",
              boxShadow: "0 0 10px rgba(177, 219, 156, 0.6)",
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
