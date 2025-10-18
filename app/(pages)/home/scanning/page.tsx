"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import type { AnalysisMarkdownResult } from "@/lib/openai/types";

type ChatMessageItem = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export default function ScanningPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [typingText, setTypingText] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("document");
  const [fileName, setFileName] = useState<string>("");

  // For backend integration later
  const [scanningComplete, setScanningComplete] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisMarkdownResult | null>(null);
  const [markdownResult, setMarkdownResult] = useState<string>("");
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [resolvedChatId, setResolvedChatId] = useState<string | null>(null);
  const lastRequestKey = useRef<string | null>(null);
  const isMountedRef = useRef(true);
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [redirectScheduled, setRedirectScheduled] = useState(false);
  const activeRequestKeyRef = useRef<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);
  const hasInjectedAnalysis = useRef(false);
  const initialGreetingSent = useRef(false);

  const fullText = "AI Sedang Bekerja...";
  const completeText = analysisError ? "Analisis Gagal" : "Analisis Selesai!";

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
  }, [completeText, scanningComplete]);

  // Scanning progress animation
  useEffect(() => {
    if (scanningComplete) {
      setScanProgress(100);
      return;
    }

    setScanProgress(0);

    const scanningInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 98) {
          return 98;
        }
        return prev + 1.5;
      });
    }, 80);

    return () => clearInterval(scanningInterval);
  }, [scanningComplete]);

  // Run alternative analysis endpoint once file and doc metadata are ready
  const chatIdParam = searchParams.get("chat_id");
  const documentIdParam = searchParams.get("document_id");
  const analysisTypeParam = searchParams.get("analysis_type");

  const handleRetry = () => {
    setScanningComplete(false);
    setAnalysisError(null);
    setAnalysisResult(null);
    setMarkdownResult("");
    lastRequestKey.current = null;
    setRetryToken((prev) => prev + 1);
    hasInjectedAnalysis.current = false;
    initialGreetingSent.current = false;
    setChatMessages([]);
    setChatError(null);
    setChatInput("");
  };

  const handleSendChat = async () => {
    const trimmed = chatInput.trim();

    if (!trimmed) {
      return;
    }

    if (!resolvedChatId) {
      setChatError("Sesi chat tidak ditemukan. Silakan muat ulang halaman.");
      return;
    }

    const userMessage: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatError(null);
    setIsSendingChat(true);

    const payloadMessage =
      !hasInjectedAnalysis.current && markdownResult
        ? `[RINGKASAN ANALISIS TERBARU]\n${markdownResult}\n\n[PERTANYAAN USER]\n${trimmed}`
        : trimmed;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: resolvedChatId,
          message: payloadMessage,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
          errorBody?.message ||
            errorBody?.error ||
            "Gagal mengirim pertanyaan. Coba lagi sebentar."
        );
      }

      const data = await response.json();

      setChatMessages((prev) => [
        ...prev,
        {
          id: data?.message_id || `assistant-${Date.now()}`,
          role: "assistant",
          content: data?.content || "Saya siap membantu!",
          createdAt: data?.metadata?.created_at || new Date().toISOString(),
        },
      ]);

      if (!hasInjectedAnalysis.current && markdownResult) {
        hasInjectedAnalysis.current = true;
      }
    } catch (error: unknown) {
      console.error("[Scanning] Chat error:", error);
      const fallbackMessage =
        "Terjadi kesalahan saat mengirim pertanyaan. Silakan coba lagi.";
      const derivedMessage =
        error instanceof Error && error.message
          ? error.message
          : typeof error === "string" && error.length > 0
          ? error
          : fallbackMessage;
      setChatError(derivedMessage);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleChatKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isSendingChat) {
        handleSendChat();
      }
    }
  };

  useEffect(() => {
    const requestKey = `${chatIdParam ?? ""}|${documentIdParam ?? ""}|${
      analysisTypeParam ?? ""
    }|${retryToken}`;

    if (lastRequestKey.current === requestKey) {
      console.log("[Scanning] Skipping analysis rerun, request key unchanged:", requestKey);
      return;
    }
    console.log("[Scanning] Starting analysis run with key:", requestKey);
    lastRequestKey.current = requestKey;
    activeRequestKeyRef.current = requestKey;

    const runAnalysis = async () => {
      let chatId = chatIdParam || "";
      let documentId = documentIdParam || "";
      let analysisType = analysisTypeParam || "";

      try {
        const storedChatId = localStorage.getItem("analysisChatId");
        const storedDocumentId = localStorage.getItem("analysisDocumentId");
        const storedAnalysisType = localStorage.getItem("analysisType");

        if (!chatId && storedChatId) chatId = storedChatId;
        if (!documentId && storedDocumentId) documentId = storedDocumentId;
        if (!analysisType && storedAnalysisType) {
          analysisType = storedAnalysisType;
        }
      } catch (storageError: unknown) {
        console.warn("[Scanning] Unable to read localStorage:", storageError);
      }

      if (!analysisType) {
        analysisType = "contract";
      }

      if (!chatId || !documentId) {
        setAnalysisError(
          "Data sesi tidak ditemukan. Silakan mulai ulang proses analisis."
        );
        setScanningComplete(true);
        console.warn("[Scanning] Missing identifiers", { chatId, documentId, analysisType });
        return;
      }

      setResolvedChatId(chatId);
      console.log("[Scanning] Fetching analysis", { chatId, documentId, analysisType });

      setScanningComplete(false);
      setAnalysisResult(null);
      setMarkdownResult("");
      setAnalysisError(null);

      try {
        const response = await fetch("/api/analyze-alternative", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            document_id: documentId,
            analysis_type: analysisType,
          }),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(
            errorBody?.message ||
              errorBody?.error ||
              "Gagal memperoleh hasil analisis."
          );
        }

        const data: AnalysisMarkdownResult = await response.json();
        console.log("[Scanning] Analysis response received", {
          id: data.analysis_id,
          analyzed_at: data.metadata?.analyzed_at,
          hasMarkdown: !!data.markdown_content,
        });
        if (!isMountedRef.current) {
          console.log("[Scanning] Analysis response ignored: component unmounted.");
          return;
        }
        if (activeRequestKeyRef.current !== requestKey) {
          console.log("[Scanning] Analysis response ignored: superseded request.", {
            expected: activeRequestKeyRef.current,
            received: requestKey,
          });
          return;
        }
        console.log("[Scanning] Applying analysis result to state");
        try {
          localStorage.setItem(
            "latestAnalysisResult",
            JSON.stringify(data)
          );
        } catch (storageError) {
          console.warn("[Scanning] Failed to cache analysis result", storageError);
        }
        setAnalysisResult(data);
        setMarkdownResult(data.markdown_content);
      } catch (error: unknown) {
        if (!isMountedRef.current) {
          console.log("[Scanning] Analysis error ignored (unmounted)");
          return;
        }
        console.error("[Scanning] Analysis error:", error);
        const fallbackMessage =
          "Terjadi kesalahan saat menjalankan analisis. Coba lagi nanti.";
        const derivedMessage =
          error instanceof Error && error.message
            ? error.message
            : typeof error === "string" && error.length > 0
            ? error
            : fallbackMessage;
        setAnalysisError(derivedMessage);
        setScanningComplete(true);
      } finally {
        // no-op
      }
    };

    runAnalysis();

    return () => {
      console.log("[Scanning] Cleanup for request key:", requestKey);
    };
  }, [analysisTypeParam, chatIdParam, documentIdParam, retryToken]);

  useEffect(() => {
    if (analysisResult && !scanningComplete) {
      console.log("[Scanning] Analysis result ready, finishing animation", {
        analysisId: analysisResult.analysis_id,
      });
      setScanningComplete(true);
      triggerConfetti();
      if (!redirectScheduled) {
        setRedirectScheduled(true);
        redirectTimeoutRef.current = setTimeout(() => {
          const target = `/home/resultDocument?analysis_id=${analysisResult.analysis_id}`;
          console.log("[Scanning] Redirecting to result page:", target);
          router.replace(target);
        }, 2200);
      }
    }
  }, [analysisResult, redirectScheduled, router, scanningComplete]);

  useEffect(() => {
    if (analysisResult && !initialGreetingSent.current) {
      setChatMessages([
        {
          id: "assistant-initial",
          role: "assistant",
          content:
            "Analisis selesai! Saya siap membantu menjelaskan hasilnya atau menjawab pertanyaan lanjutan Anda.",
          createdAt: new Date().toISOString(),
        },
      ]);
      initialGreetingSent.current = true;
    }
  }, [analysisResult]);

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
              className="animate-bounce lg:w-9 lg:h-9"
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

      {/* Analysis Result Surface */}
      {scanningComplete && (
        <div className="w-full max-w-4xl mx-auto relative z-10 animate-fade-in">
          {analysisError ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 text-center">
              <h2
                className="text-hijautua font-semibold text-xl mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Analisis Gagal
              </h2>
              <p className="text-gray-600 mb-6">{analysisError}</p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center justify-center rounded-full bg-hijauterang/90 text-white px-6 py-3 font-semibold transition-transform hover:scale-105"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Coba Lagi
              </button>
            </div>
          ) : redirectScheduled ? (
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl border border-white/60 p-10 text-center space-y-4">
              <h2
                className="text-2xl font-bold text-hijautua"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Analisis Selesai!
              </h2>
              <p className="text-gray-600">
                Kami menyiapkan halaman hasil lengkap Anda. Sebentar lagi Anda
                akan diarahkan secara otomatis.
              </p>
              <p className="text-sm text-gray-400">
                Jika tidak berpindah otomatis dalam beberapa detik, klik tombol
                di bawah ini.
              </p>
              <button
                onClick={() => {
                  if (analysisResult) {
                    router.replace(
                      `/home/resultDocument?analysis_id=${analysisResult.analysis_id}`
                    );
                  }
                }}
                className="inline-flex items-center justify-center rounded-full bg-hijauterang text-white px-6 py-3 font-semibold transition-transform hover:scale-105"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Buka Halaman Hasil
              </button>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 text-center">
              <p className="text-gray-600">
                Menyusun hasil analisis terbaik untuk dokumen Anda...
              </p>
            </div>
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
