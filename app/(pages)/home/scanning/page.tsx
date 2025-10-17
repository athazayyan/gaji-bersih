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

  // For backend integration later
  const [scanningComplete, setScanningComplete] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const fullText = "AI Sedang Bekerja...";
  const completeText = "Analisis Selesai!";

  // Load file from localStorage
  useEffect(() => {
    const savedFile = localStorage.getItem("uploadedFile");
    const savedFileType = localStorage.getItem("uploadedFileType");
    const savedFileName = localStorage.getItem("uploadedFileName");

    console.log("Loaded from localStorage:", {
      savedFile: savedFile ? `${savedFile.substring(0, 50)}...` : "null",
      savedFileType,
      savedFileName,
      fileUrlLength: savedFile?.length,
    });

    if (savedFile) {
      setFilePreview(savedFile);
      console.log("File preview set successfully");
    } else {
      console.error("No file found in localStorage");
    }

    if (savedFileType) {
      setFileType(savedFileType);
      console.log("File type:", savedFileType);
    }

    if (savedFileName) {
      setFileName(savedFileName);
    }

    // TODO: Backend Integration Point
    // When backend is ready, replace this with actual API call
    // Example:
    // const uploadAndAnalyze = async () => {
    //   const formData = new FormData();
    //   formData.append('file', fileBlob);
    //   const response = await fetch('/api/analyze', {
    //     method: 'POST',
    //     body: formData
    //   });
    //   const data = await response.json();
    //   setAnalysisData(data);
    //   setScanningComplete(true);
    // };
    // uploadAndAnalyze();
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (scanningComplete) {
      setTypingText(completeText);
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
  }, [scanningComplete]);

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

  // Simulate scanning completion (For MVP Demo)
  // TODO: Remove this when backend is integrated
  useEffect(() => {
    const timer = setTimeout(() => {
      setScanningComplete(true);
      console.log("Scanning simulation complete");

      // Mock analysis data (replace with actual backend response)
      const mockAnalysisData = {
        gajiPokok: 8000000,
        tunjangan: {
          kesehatan: 500000,
          transport: 300000,
          makan: 400000,
        },
        potongan: {
          bpjs: 100000,
          pajak: 400000,
        },
        gajiBersih: 8700000,
      };
      setAnalysisData(mockAnalysisData);

      // Trigger confetti animation
      setShowConfetti(true);
      triggerConfetti();
    }, 5000); // Changed to 5 seconds

    return () => clearTimeout(timer);
  }, [router]);

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
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: "var(--gradient-scanning)",
      }}
    >
      {/* Typing Text Animation */}
      <div className="mb-12 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <h1
            className={`text-white text-center font-bold transition-all duration-500 ${
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

          {/* Success Icon - appears beside text when complete */}
          {scanningComplete && (
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
              className="animate-bounce"
              style={{
                filter: "drop-shadow(0 0 10px rgba(177, 219, 156, 0.8))",
              }}
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="8 12 11 15 16 9" />
            </svg>
          )}
        </div>
      </div>

      {/* Document Preview with Scanning Animation */}
      <div className="relative mb-12 z-10">
        {/* Document Frame with Modern Corner Brackets */}
        <div className="relative">
          {/* Corner Brackets - Enhanced Modern Design */}
          <div className="absolute -inset-5 z-10">
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-10 h-10">
              <div
                className="absolute top-0 left-0 w-8 h-1.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
              <div
                className="absolute top-0 left-0 w-1.5 h-8 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
            </div>
            {/* Top Right */}
            <div className="absolute top-0 right-0 w-10 h-10">
              <div
                className="absolute top-0 right-0 w-8 h-1.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(270deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
              <div
                className="absolute top-0 right-0 w-1.5 h-8 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
            </div>
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-10 h-10">
              <div
                className="absolute bottom-0 left-0 w-8 h-1.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-1.5 h-8 rounded-full"
                style={{
                  background: "linear-gradient(0deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
            </div>
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-10 h-10">
              <div
                className="absolute bottom-0 right-0 w-8 h-1.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(270deg, #B0DB9C 0%, #77BF5A 100%)",
                  boxShadow:
                    "0 0 15px rgba(177, 219, 156, 0.8), 0 0 25px rgba(119, 191, 90, 0.4)",
                }}
              ></div>
              <div
                className="absolute bottom-0 right-0 w-1.5 h-8 rounded-full"
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
            className="bg-white rounded-xl overflow-hidden relative"
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
        <div className="w-full max-w-sm relative z-10 animate-fade-in">
          <button
            onClick={() => {
              // Navigate to results page
              console.log("Analysis data ready:", analysisData);
              router.push("/home/resultDocument");
            }}
            className="w-full bg-white text-hijautua font-semibold py-4 rounded-full transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              boxShadow:
                "0 0 20px rgba(177, 219, 156, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)",
            }}
          >
            Lihat Hasil
          </button>
        </div>
      )}

      {/* Loading Dots Animation - Only show when scanning */}
      {!scanningComplete && (
        <div className="flex space-x-3 mt-8 relative z-10">
          <div
            className="w-2.5 h-2.5 rounded-full animate-bounce"
            style={{
              animationDelay: "0ms",
              background: "#B0DB9C",
              boxShadow: "0 0 10px rgba(177, 219, 156, 0.6)",
            }}
          ></div>
          <div
            className="w-2.5 h-2.5 rounded-full animate-bounce"
            style={{
              animationDelay: "150ms",
              background: "#B0DB9C",
              boxShadow: "0 0 10px rgba(177, 219, 156, 0.6)",
            }}
          ></div>
          <div
            className="w-2.5 h-2.5 rounded-full animate-bounce"
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
