"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

import type { AnalysisMarkdownResult } from "@/lib/openai/types";

type ChatMessageItem = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

const DOC_TYPE_LABELS: Record<string, string> = {
  contract: "Kontrak Kerja",
  payslip: "Slip Gaji",
  nda: "Perjanjian NDA",
  policy: "Dokumen Kebijakan",
};

const SEARCH_METHOD_LABELS: Record<string, string> = {
  file_search: "File Search",
  web_search: "Web Search",
};

const SUGGESTION_QUESTIONS = [
  "Tolong jelaskan klausul yang paling berisiko.",
  "Apa rekomendasi tindakan yang bisa saya ambil?",
  "Bagaimana cara saya menyampaikan keberatan ke HR?",
  "Adakah dasar hukum yang bisa saya jadikan rujukan?",
];

export default function ResultDocumentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryAnalysisId = searchParams.get("analysis_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisMarkdownResult | null>(null);
  const [markdownResult, setMarkdownResult] = useState("");

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("document");

  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [resolvedChatId, setResolvedChatId] = useState<string | null>(null);
  const initialMessageSentRef = useRef(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("latestAnalysisResult");
      if (!cached) {
        setError(
          "Hasil analisis terbaru tidak ditemukan. Silakan ulangi proses analisis."
        );
        setLoading(false);
        return;
      }

      const parsed: AnalysisMarkdownResult = JSON.parse(cached);

      if (queryAnalysisId && parsed.analysis_id !== queryAnalysisId) {
        console.warn("[ResultPage] Cached analysis does not match query id");
      }

      setAnalysisResult(parsed);
      setMarkdownResult(parsed.markdown_content);
      setResolvedChatId(parsed.chat_id);
      setLoading(false);
    } catch (parseError) {
      console.error("[ResultPage] Failed to parse cached result:", parseError);
      setError(
        "Terjadi kesalahan saat membaca hasil analisis. Silakan analisis kembali dokumen Anda."
      );
      setLoading(false);
    }
  }, [queryAnalysisId]);

  useEffect(() => {
    const savedFile = typeof window !== "undefined"
      ? localStorage.getItem("uploadedFile")
      : null;
    const savedFileType =
      typeof window !== "undefined"
        ? localStorage.getItem("uploadedFileType")
        : null;
    const savedFileName =
      typeof window !== "undefined"
        ? localStorage.getItem("uploadedFileName")
        : null;

    if (savedFile) setFilePreview(savedFile);
    if (savedFileType) setFileType(savedFileType);
    if (savedFileName) setFileName(savedFileName);
  }, []);

  useEffect(() => {
    if (analysisResult && !initialMessageSentRef.current) {
      setChatMessages([
        {
          id: "assistant-initial",
          role: "assistant",
          content:
            "Analisis dokumen Anda siap! Saya sudah menyiapkan ringkasan lengkap beserta rekomendasi yang bisa ditindaklanjuti. Jika ada bagian yang ingin Anda gali lebih dalam, tinggal ajukan pertanyaannya.",
          createdAt: new Date().toISOString(),
        },
      ]);
      initialMessageSentRef.current = true;
    }
  }, [analysisResult]);

  const handleSendChat = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || !analysisResult) {
      return;
    }

    const chatId = analysisResult.chat_id || resolvedChatId;
    if (!chatId) {
      setChatError(
        "Sesi percakapan tidak ditemukan. Silakan ulangi proses analisis."
      );
      return;
    }

    // Validate chat_id is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(chatId)) {
      console.error("[ResultPage] Invalid chat_id format:", chatId);
      setChatError(
        "ID sesi percakapan tidak valid. Silakan ulangi proses analisis."
      );
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

    // Don't inject the full markdown result - it might be too long
    // Just send the user's message directly
    const payloadMessage = trimmed;

    console.log("[ResultPage] Sending chat message:", {
      chat_id: chatId,
      messageLength: payloadMessage.length,
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          message: payloadMessage,
          include_web_search: true,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.error("[ResultPage] Chat API error:", errorBody);
        throw new Error(
          errorBody?.details 
            ? `${errorBody.error}: ${JSON.stringify(errorBody.details)}`
            : errorBody?.message || errorBody?.error || "Gagal mengirim pertanyaan. Coba lagi sebentar."
        );
      }

      const data = await response.json();
      console.log("[ResultPage] Chat response received:", data);
      
      setChatMessages((prev) => [
        ...prev,
        {
          id: data?.message_id || `assistant-${Date.now()}`,
          role: "assistant",
          content:
            data?.content ||
            "Saya siap membantu! Silakan tanyakan bagian lain dari hasil analisis.",
          createdAt: data?.metadata?.created_at || new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("[ResultPage] Chat error:", error);
      const fallbackMessage =
        "Terjadi kesalahan saat menghubungi AI. Silakan coba lagi.";
      setChatError(
        error instanceof Error && error.message
          ? error.message
          : fallbackMessage
      );
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

  const documentLabel = useMemo(() => {
    if (!analysisResult) return "Dokumen";
    return (
      DOC_TYPE_LABELS[analysisResult.document.type?.toLowerCase()] ||
      "Dokumen"
    );
  }, [analysisResult]);

  const searchMethodBadges = useMemo(() => {
    if (!analysisResult) return [];
    return analysisResult.metadata.search_methods_used.map((method) => ({
      key: method,
      label: SEARCH_METHOD_LABELS[method] || method,
    }));
  }, [analysisResult]);

  const tokensUsed = analysisResult?.metadata.tokens_used;

  const handleBackToHome = () => {
    router.push("/home");
  };

  const handleUploadAgain = () => {
    router.push("/home/uploadBerkas");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-hijauterang border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600">
            Menyiapkan halaman hasil analisis Anda...
          </p>
        </div>
      </div>
    );
  }

  if (error || !analysisResult) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-lg bg-white shadow-xl rounded-3xl border border-gray-100 p-8 text-center space-y-6">
          <h1
            className="text-2xl font-bold text-hijautua"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Hasil Analisis Tidak Tersedia
          </h1>
          <p className="text-gray-600">
            {error ||
              "Kami tidak menemukan hasil analisis terbaru. Silakan ulangi proses pengunggahan dokumen Anda."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleBackToHome}
              className="px-5 py-3 rounded-full border border-hijautua text-hijautua font-semibold hover:bg-hijautua hover:text-white transition-all"
            >
              Kembali ke Beranda
            </button>
            <button
              onClick={handleUploadAgain}
              className="px-5 py-3 rounded-full bg-hijauterang text-white font-semibold hover:opacity-90 transition-all"
            >
              Analisis Ulang Dokumen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-gray-50 lg:via-green-50/25 lg:to-emerald-50/40 pb-16 relative">
      <style jsx global>{`
        .markdown-content {
          line-height: 1.8;
          color: #374151;
          max-width: 100%;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
        }
        .markdown-content * {
          max-width: 100%;
        }
        .markdown-content h1:first-child {
          margin-top: 0;
        }
        .markdown-content h2 + h3,
        .markdown-content h3 + h4 {
          margin-top: 1.5rem;
        }
        .markdown-content h3 + p,
        .markdown-content h4 + p {
          margin-top: 1rem;
        }
        .markdown-content p:last-child {
          margin-bottom: 0;
        }
        .markdown-content ul ul,
        .markdown-content ol ul,
        .markdown-content ul ol,
        .markdown-content ol ol {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          margin-left: 1.5rem;
        }
        .markdown-content blockquote p {
          margin-bottom: 0;
        }
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          display: block;
          overflow-x: auto;
        }
        .markdown-content hr {
          margin: 2rem 0;
          border: none;
          border-top: 2px solid #e5e7eb;
        }
        .markdown-content > *:first-child {
          margin-top: 0 !important;
        }
        .markdown-content pre {
          margin: 1.5rem 0;
          border-radius: 0.5rem;
          overflow-x: auto;
          max-width: 100%;
        }
        .markdown-content code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.875rem;
        }
        .markdown-content pre code {
          display: block;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .markdown-content a {
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .markdown-content p,
        .markdown-content li,
        .markdown-content blockquote {
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }
        
        /* Chat message markdown styling */
        .prose.prose-sm {
          font-size: 0.875rem;
          line-height: 1.6;
        }
        .prose.prose-sm > * {
          margin-top: 0;
          margin-bottom: 0;
        }
        .prose.prose-sm p {
          line-height: 1.6;
        }
        .prose.prose-sm ol {
          padding-left: 1rem;
        }
        .prose.prose-sm ul {
          padding-left: 0;
        }
        .prose.prose-sm li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }
        .prose.prose-sm strong {
          font-weight: 700;
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-20 w-[460px] h-[460px] bg-hijauterang/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-28 w-[520px] h-[520px] bg-hijautua/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-[420px] h-[420px] bg-hijaumuda/10 rounded-full blur-2xl" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-10">
        <header className="bg-white/90 backdrop-blur-md border border-white/50 rounded-3xl shadow-lg p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-hijauterang/15 text-hijauterang">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="8 12 11 15 16 9" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-hijauterang font-semibold uppercase tracking-[0.3em] mb-2">
                Analisis Selesai
              </p>
              <h1
                className="text-2xl lg:text-3xl font-bold text-hijautua leading-snug"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {analysisResult.document.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-hijauterang/10 text-hijautua font-medium">
                  <span className="inline-block w-2 h-2 bg-hijauterang rounded-full" />
                  {documentLabel}
                </span>
                <span>
                  Diperiksa pada{" "}
                  <strong>
                    {new Date(
                      analysisResult.metadata.analyzed_at
                    ).toLocaleString("id-ID", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </strong>
                </span>
                <span>
                  Model:{" "}
                  <strong className="text-hijautua">
                    {analysisResult.metadata.model_used}
                  </strong>
                </span>
                {analysisResult.metadata.processing_time_ms && (
                  <span>
                    Durasi proses:{" "}
                    <strong>
                      {Math.round(
                        analysisResult.metadata.processing_time_ms / 1000
                      )}{" "}
                      detik
                    </strong>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBackToHome}
              className="px-5 py-3 rounded-full border border-hijautua text-hijautua font-semibold hover:bg-hijautua hover:text-white transition-all"
            >
              Kembali ke Beranda
            </button>
            <button
              onClick={handleUploadAgain}
              className="px-5 py-3 rounded-full bg-hijauterang text-white font-semibold hover:opacity-90 transition-all"
            >
              Analisis Dokumen Lain
            </button>
          </div>
        </header>

        <section className="grid lg:grid-cols-[1fr,400px] gap-8 items-start">
          {/* Left Column - Analysis Results (Scrollable) */}
          <div className="space-y-6 min-w-0">
            <article className="space-y-6">
              <div className="bg-white/95 backdrop-blur rounded-3xl shadow-lg border border-white/60 p-6 lg:p-8 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                {searchMethodBadges.map((badge) => (
                  <span
                    key={badge.key}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-hijauterang/10 text-hijautua font-medium text-xs uppercase tracking-wide"
                  >
                    <span className="inline-block w-2 h-2 bg-hijauterang rounded-full" />
                    {badge.label}
                    <span className="sr-only">{badge.key}</span>
                  </span>
                ))}
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                    ID Analisis
                  </p>
                  <p className="text-sm text-gray-700 break-all mt-1">
                    {analysisResult.analysis_id}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                    ID Chat
                  </p>
                  <p className="text-sm text-gray-700 break-all mt-1">
                    {analysisResult.chat_id}
                  </p>
                </div>
                {tokensUsed && (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                      Penggunaan Token
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      Total:{" "}
                      <strong>
                        {tokensUsed.total_tokens.toLocaleString("id-ID")}
                      </strong>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Prompt {tokensUsed.prompt_tokens.toLocaleString("id-ID")} •
                      Completion{" "}
                      {tokensUsed.completion_tokens.toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-100 shadow-inner p-6 lg:p-8">
                <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          className="text-hijauterang underline underline-offset-4 decoration-hijauterang/50 hover:text-hijautua hover:decoration-hijautua transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1
                          {...props}
                          className="text-3xl font-bold mt-0 mb-6 text-hijautua border-b-2 border-hijautua/20 pb-4"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          {...props}
                          className="text-2xl font-semibold mt-8 mb-5 text-hijauterang flex items-center gap-3 border-l-4 border-hijauterang pl-4"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          {...props}
                          className="text-xl font-semibold mt-6 mb-3 text-hijautua bg-hijautua/5 px-4 py-2 rounded-lg"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        />
                      ),
                      h4: ({ node, ...props }) => (
                        <h4
                          {...props}
                          className="text-lg font-semibold mt-4 mb-2 text-gray-800"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p
                          {...props}
                          className="text-gray-700 leading-relaxed mb-4 text-base break-words"
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          {...props}
                          className="space-y-2 my-4 ml-2"
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          {...props}
                          className="list-decimal space-y-2 my-4 ml-6 marker:text-hijauterang marker:font-semibold"
                        />
                      ),
                      li: ({ node, children, ...props }) => {
                        // Check if this is a checkbox item
                        const childText = children?.toString() || '';
                        const isChecked = childText.startsWith('[✅]') || childText.startsWith('[x]');
                        const isUnchecked = childText.startsWith('[ ]');
                        
                        if (isChecked || isUnchecked) {
                          // Remove the checkbox markdown and render as styled checkbox
                          const text = childText.replace(/^\[(✅|x| )\]\s*/, '');
                          return (
                            <li
                              {...props}
                              className="flex items-start gap-3 text-gray-700 leading-relaxed break-words"
                            >
                              <span className={`inline-flex items-center justify-center w-5 h-5 rounded border-2 mt-0.5 flex-shrink-0 ${
                                isChecked 
                                  ? 'bg-hijauterang border-hijauterang' 
                                  : 'bg-white border-gray-300'
                              }`}>
                                {isChecked && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="white"
                                    className="w-4 h-4"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </span>
                              <span className="break-words min-w-0 flex-1">{text}</span>
                            </li>
                          );
                        }
                        
                        // Regular list item with bullet
                        return (
                          <li
                            {...props}
                            className="flex items-start gap-2 text-gray-700 leading-relaxed break-words"
                          >
                            <span className="text-hijauterang font-bold text-lg mt-0.5 flex-shrink-0">•</span>
                            <span className="break-words min-w-0 flex-1">{children}</span>
                          </li>
                        );
                      },
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          {...props}
                          className="border-l-4 border-hijauterang/80 pl-5 pr-4 py-3 my-4 italic text-gray-700 bg-hijauterang/5 rounded-r-lg shadow-sm break-words overflow-wrap-anywhere"
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          {...props}
                          className="font-bold text-hijautua"
                        />
                      ),
                      em: ({ node, ...props }) => (
                        <em
                          {...props}
                          className="italic text-gray-600"
                        />
                      ),
                      hr: ({ node, ...props }) => (
                        <hr
                          {...props}
                          className="my-8 border-t-2 border-gray-200"
                        />
                      ),
                      code: ({ node, inline, ...props }: any) =>
                        inline ? (
                          <code
                            {...props}
                            className="px-2 py-1 bg-hijautua/10 text-hijautua rounded text-sm font-mono border border-hijautua/20 break-all"
                          />
                        ) : (
                          <div className="relative my-4 rounded-lg overflow-hidden">
                            <code
                              {...props}
                              className="block p-4 bg-gray-900 text-gray-100 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words"
                              style={{ 
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere'
                              }}
                            />
                          </div>
                        ),
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 shadow-sm">
                          <table
                            {...props}
                            className="min-w-full divide-y divide-gray-200"
                          />
                        </div>
                      ),
                      thead: ({ node, ...props }) => (
                        <thead
                          {...props}
                          className="bg-hijauterang/10"
                        />
                      ),
                      th: ({ node, ...props }) => (
                        <th
                          {...props}
                          className="px-6 py-3 text-left text-sm font-semibold text-hijautua"
                        />
                      ),
                      tbody: ({ node, ...props }) => (
                        <tbody
                          {...props}
                          className="bg-white divide-y divide-gray-100"
                        />
                      ),
                      td: ({ node, ...props }) => (
                        <td
                          {...props}
                          className="px-6 py-4 text-sm text-gray-700"
                        />
                      ),
                    }}
                  >
                    {markdownResult}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-3xl border border-white/60 shadow-lg p-6 lg:p-8 space-y-6">
              <h2
                className="text-lg font-semibold text-hijautua"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Langkah Selanjutnya yang Direkomendasikan
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 space-y-2">
                  <p className="text-sm font-semibold text-hijautua">
                    Diskusikan dengan HR
                  </p>
                  <p className="text-sm text-gray-600">
                    Sampaikan temuan penting dari analisis ini dan minta klarifikasi
                    tertulis untuk klausul yang berisiko.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 space-y-2">
                  <p className="text-sm font-semibold text-hijautua">
                    Siapkan Bukti Pendukung
                  </p>
                  <p className="text-sm text-gray-600">
                    Kumpulkan referensi hukum atau dokumen pembanding jika ingin
                    mengajukan keberatan.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 space-y-2">
                  <p className="text-sm font-semibold text-hijautua">
                    Konsultasi Profesional
                  </p>
                  <p className="text-sm text-gray-600">
                    Pertimbangkan berkonsultasi dengan konsultan ketenagakerjaan
                    untuk saran strategis berikutnya.
                  </p>
                </div>
              </div>
            </div>
          </article>
          </div>

          {/* Right Column - Chat & Document Summary (Sticky) */}
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-lg border border-white/60 p-6 space-y-4">
              <div className="space-y-4">
                <h2
                  className="text-lg font-semibold text-hijautua"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Ringkasan Dokumen
                </h2>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/90 p-4 flex flex-col items-center text-center space-y-3">
                  {filePreview && fileType === "image" ? (
                    <img
                      src={filePreview}
                      alt="Preview Dokumen"
                      className="w-full rounded-xl object-cover max-h-64"
                    />
                  ) : (
                    <div className="w-20 h-24 rounded-xl bg-hijauterang/10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
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
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-hijautua">
                      {fileName || analysisResult.document.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {fileType === "pdf" ? "PDF" : fileType}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-hijautua">
                      Diunggah pada
                    </span>
                    <span className="text-right">
                      {new Date(
                        analysisResult.document.uploaded_at
                      ).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-hijautua">
                      Jenis Dokumen
                    </span>
                    <span className="text-right capitalize">
                      {analysisResult.document.type || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-lg border border-white/60 p-6 space-y-4">
              <h2
                className="text-lg font-semibold text-hijautua"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Tanya AI
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tanyakan hal-hal terkait hasil analisis dokumen Anda.
              </p>

              <div className="flex flex-wrap gap-2">
                {SUGGESTION_QUESTIONS.slice(0, 2).map((question) => (
                  <button
                    key={question}
                    onClick={() => {
                      setChatInput(question);
                    }}
                    className="px-2.5 py-1.5 rounded-full border border-hijauterang text-hijauterang text-xs font-medium hover:bg-hijauterang/10 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <div className="bg-gray-50/90 rounded-2xl border border-gray-100 shadow-inner h-[400px] overflow-y-auto p-4 space-y-3 scroll-smooth">
                {chatMessages.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Belum ada percakapan. Mulai dengan pertanyaan cepat atau
                    tulis pesan Anda sendiri di bawah.
                  </p>
                ) : (
                  <>
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                            message.role === "user"
                              ? "bg-hijauterang text-white"
                              : "bg-white text-gray-700 border border-gray-200"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                              <ReactMarkdown
                                components={{
                                  p: ({ node, ...props }) => (
                                    <p {...props} className="mb-2 last:mb-0 break-words" />
                                  ),
                                  strong: ({ node, ...props }) => (
                                    <strong {...props} className="font-bold text-hijautua" />
                                  ),
                                  em: ({ node, ...props }) => (
                                    <em {...props} className="italic" />
                                  ),
                                  ul: ({ node, ...props }) => (
                                    <ul {...props} className="list-none space-y-1 my-2" />
                                  ),
                                  ol: ({ node, ...props }) => (
                                    <ol {...props} className="list-decimal ml-4 space-y-1 my-2 marker:text-hijauterang marker:font-semibold" />
                                  ),
                                  li: ({ node, ...props }) => (
                                    <li {...props} className="break-words" />
                                  ),
                                  a: ({ node, ...props }) => (
                                    <a
                                      {...props}
                                      className="text-hijauterang underline hover:text-hijautua"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    />
                                  ),
                                  code: ({ node, inline, ...props }: any) =>
                                    inline ? (
                                      <code
                                        {...props}
                                        className="px-1.5 py-0.5 bg-gray-100 text-hijautua rounded text-xs font-mono"
                                      />
                                    ) : (
                                      <code
                                        {...props}
                                        className="block p-2 bg-gray-100 text-gray-800 rounded text-xs font-mono overflow-x-auto my-2"
                                      />
                                    ),
                                  blockquote: ({ node, ...props }) => (
                                    <blockquote
                                      {...props}
                                      className="border-l-2 border-hijauterang/60 pl-3 my-2 italic text-gray-600"
                                    />
                                  ),
                                  h1: ({ node, ...props }) => (
                                    <h1 {...props} className="text-base font-bold mt-3 mb-2 text-hijautua" />
                                  ),
                                  h2: ({ node, ...props }) => (
                                    <h2 {...props} className="text-sm font-bold mt-2 mb-1 text-hijautua" />
                                  ),
                                  h3: ({ node, ...props }) => (
                                    <h3 {...props} className="text-sm font-semibold mt-2 mb-1 text-gray-800" />
                                  ),
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {message.content}
                            </p>
                          )}
                          <span className="block text-[10px] opacity-70 mt-2">
                            {new Date(message.createdAt).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isSendingChat && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] rounded-2xl px-4 py-3 shadow-sm bg-white border border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-hijauterang rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-hijauterang rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-hijauterang rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-xs text-gray-500">AI sedang mengetik...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatMessagesEndRef} />
                  </>
                )}
              </div>

              {chatError && (
                <div className="bg-red-50 text-red-600 text-xs rounded-xl px-3 py-2 border border-red-100 flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="break-words flex-1">{chatError}</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  onKeyDown={handleChatKeyDown}
                  placeholder="Tulis pertanyaan..."
                  className="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hijauterang/50 disabled:bg-gray-100"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  disabled={isSendingChat || !resolvedChatId}
                />
                <button
                  onClick={handleSendChat}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-hijauterang text-white px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  disabled={
                    isSendingChat ||
                    !resolvedChatId ||
                    chatInput.trim().length === 0
                  }
                >
                  {isSendingChat ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      Kirim
                    </>
                  )}
                </button>
              </div>

              {!resolvedChatId && (
                <p className="text-xs text-gray-500">
                  ID sesi chat tidak ditemukan. Mulai ulang analisis untuk
                  melanjutkan percakapan.
                </p>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
