"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  className?: string;
}

export default function ChatBot({ className }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Halo! Saya adalah AI Assistant GajiBersih. Saya siap membantu Anda dengan pertanyaan seputar analisis dokumen yang telah dilakukan. Silakan tanyakan apa saja yang ingin Anda ketahui!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Default expanded untuk langsung bisa digunakan
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick suggestion questions
  const suggestionQuestions = [
    "Apa saja klausul berisiko dalam kontrak saya?",
    "Bagaimana cara negosiasi dengan HR terkait denda?",
    "Apakah kontrak ini sesuai UU Ketenagakerjaan?",
    "Apa hak saya sebagai pekerja?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Auto focus pada input ketika ChatBot terbuka
    if (isExpanded && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Delay untuk menunggu animation selesai
    }
  }, [messages, isExpanded]);

  // Dummy AI responses - nanti akan dihubungkan dengan backend AI
  const generateAIResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();

    // Contextual responses based on keywords
    if (
      lowercaseMessage.includes("denda") ||
      lowercaseMessage.includes("keterlambatan")
    ) {
      return "Terkait denda keterlambatan yang ditemukan dalam analisis, menurut UU Ketenagakerjaan, denda tidak boleh melebihi 2.5% dari gaji bulanan. Saya sarankan untuk menanyakan kepada HR: 1) Dasar hukum penetapan denda, 2) Mekanisme perhitungan, 3) Batas maksimal denda yang diperbolehkan.";
    }

    if (
      lowercaseMessage.includes("klausul") ||
      lowercaseMessage.includes("risiko") ||
      lowercaseMessage.includes("berisiko")
    ) {
      return "Berdasarkan analisis dokumen Anda, ditemukan 1 klausul berisiko yaitu denda keterlambatan. Klausul ini perlu diwaspadai karena dapat merugikan secara finansial. Apakah ada klausul lain yang ingin Anda tanyakan?";
    }

    if (
      lowercaseMessage.includes("negosiasi") ||
      lowercaseMessage.includes("hr")
    ) {
      return "Untuk negosiasi dengan HR, saya sarankan: 1) Siapkan argumen berdasarkan UU Ketenagakerjaan, 2) Tanyakan justifikasi kebijakan denda, 3) Minta penjelasan tertulis tentang mekanisme denda, 4) Usulkan alternatif sanksi yang lebih adil seperti teguran tertulis.";
    }

    if (
      lowercaseMessage.includes("hak") ||
      lowercaseMessage.includes("pekerja")
    ) {
      return "Hak-hak Anda sebagai pekerja berdasarkan UU No. 13/2003: 1) Mendapat perlakuan yang adil tanpa diskriminasi, 2) Mendapat upah sesuai kesepakatan, 3) Mendapat perlindungan keselamatan kerja, 4) Tidak dikenakan denda berlebihan, 5) Mendapat cuti dan istirahat sesuai ketentuan.";
    }

    if (
      lowercaseMessage.includes("kontrak") ||
      lowercaseMessage.includes("legal") ||
      lowercaseMessage.includes("uu")
    ) {
      return "Kontrak kerja Anda harus sesuai dengan UU Ketenagakerjaan No. 13 Tahun 2003. Berdasarkan analisis, ada beberapa poin yang perlu diperhatikan. Semua klausul dalam kontrak tidak boleh bertentangan dengan peraturan perundang-undangan yang berlaku.";
    }

    // Default responses
    const responses = [
      "Berdasarkan analisis dokumen Anda, saya dapat membantu menjelaskan lebih detail. Apakah ada aspek tertentu yang ingin Anda ketahui lebih lanjut?",
      "Saya dapat membantu Anda memahami klausul-klausul dalam kontrak berdasarkan hasil analisis AI. Silakan tanyakan hal spesifik yang ingin diketahui.",
      "Untuk pertanyaan lebih spesifik tentang hak pekerja atau analisis kontrak, saya siap membantu. Apakah ada hal tertentu yang mengkhawatirkan Anda?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <div className={`${className || ""}`}>
      {/* ChatBot Header/Toggle */}
      <div
        className="bg-gradient-hijau p-4 rounded-2xl cursor-pointer hover:opacity-95 transition-all"
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!isExpanded) {
            // Reset typing state ketika membuka kembali
            setIsTyping(false);
            setInputText("");
          }
        }}
        style={{
          filter: "drop-shadow(0px 4px 12px rgba(33, 56, 19, 0.15))",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative">
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h8" />
                <path d="M8 14h6" />
              </svg>
              {/* Online indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3
                className="text-white font-semibold"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                }}
              >
                AI Assistant
              </h3>
              <p
                className="text-white opacity-90 text-xs"
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Siap menjawab pertanyaan Anda
              </p>
            </div>
          </div>
          <div
            className={`transform transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* ChatBot Expanded Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-[450px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="bg-white rounded-2xl border border-gray-100"
          style={{
            filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
          }}
        >
          {/* Messages Container */}
          <div
            className="h-72 overflow-y-auto p-4 space-y-3"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#E0E0E0 transparent",
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? "bg-gradient-hijau text-white"
                      : "bg-gray-50 text-hijautua"
                  }`}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 text-hijautua p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-hijautua rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-hijautua rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-hijautua rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions - Always visible */}
          <div className="px-4 pb-2 border-t border-gray-100">
            <p
              className="text-xs text-gray-500 mb-2 pt-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Pertanyaan cepat:
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestionQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs bg-gradient-hijau text-white rounded-full hover:opacity-90 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:scale-100"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {question.length > 30
                    ? question.substring(0, 27) + "..."
                    : question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Contoh: Bagaimana cara negosiasi dengan HR?"
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-hijautua transition-colors"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                }}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className={`text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isTyping && inputText.trim()
                    ? "bg-gradient-hijau hover:opacity-90 scale-105"
                    : "bg-gray-400"
                }`}
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
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
