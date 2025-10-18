"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadBerkasPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      generatePreview(file);
    }
  };

  const generatePreview = (file: File) => {
    setIsPreviewLoading(true);

    // Create object URL for all file types
    const fileUrl = URL.createObjectURL(file);
    setFilePreview(fileUrl);
    setIsPreviewLoading(false);
  };

  const getFileType = (file: File) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type === "application/pdf") return "pdf";
    if (
      file.type.includes("word") ||
      file.name.endsWith(".docx") ||
      file.name.endsWith(".doc")
    )
      return "document";
    return "other";
  };

  // Cleanup object URLs when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
      generatePreview(files[0]);
    }
  };

  const handleAnalysis = () => {
    if (selectedFile) {
      // Save file preview to localStorage for scanning page (if available)
      if (filePreview) {
        localStorage.setItem("uploadedFile", filePreview);
      }
      localStorage.setItem("uploadedFileType", getFileType(selectedFile));
      localStorage.setItem("uploadedFileName", selectedFile.name);

      // Navigate to scanning page
      console.log("Starting analysis for:", selectedFile.name);
      router.push("/home/scanning");
    }
  };

  return (
    <>
      {/* Mobile Layout - Unchanged */}
      <div className="min-h-screen bg-white lg:hidden">
        {/* Header Section with Gradient */}
        <div
          className="bg-gradient-hijau relative"
          style={{
            width: "100%",
            maxWidth: "414px",
            height: "184px",
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
              className="text-white font-semibold mb-3"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "20px",
                lineHeight: "1.2",
              }}
            >
              Unggah Penawaran Kerjamu
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
              Untuk melanjutkan, silakan unggah atau ambil foto surat penawaran
              atau kontrak kerjamu.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 pt-8">
          <div className="max-w-md mx-auto">
            {/* Hidden File Input - Accessible globally */}
            <input
              id="file-input"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Upload Section Title */}
            <h2
              className="text-hijautua font-medium mb-6"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "20px",
              }}
            >
              Upload Berkas Penawaran
            </h2>

            {/* Upload Area / File Preview Section */}
            {selectedFile ? (
              /* File Preview Section */
              <div>
                <div
                  className="border rounded-xl overflow-hidden bg-white shadow-sm"
                  style={{
                    width: "100%",
                    maxWidth: "361px",
                    height: "400px",
                    margin: "0 auto",
                    border: "1px solid #E0E0E0",
                  }}
                >
                  {isPreviewLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hijautua mx-auto mb-2"></div>
                        <p className="text-gray-600 text-sm">
                          Memuat preview...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {getFileType(selectedFile) === "image" && filePreview && (
                        <div className="h-full overflow-auto">
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-full h-auto object-contain"
                            style={{
                              minHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      )}

                      {getFileType(selectedFile) === "pdf" && filePreview && (
                        <iframe
                          src={filePreview}
                          className="w-full h-full border-0"
                          title="PDF Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      )}

                      {(getFileType(selectedFile) === "document" ||
                        getFileType(selectedFile) === "other") && (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#213813"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-4"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                          <h4
                            className="text-hijautua font-medium mb-2"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "14px",
                            }}
                          >
                            {selectedFile.name}
                          </h4>
                          <p
                            className="text-gray-600 mb-4"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "12px",
                            }}
                          >
                            Ukuran:{" "}
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p
                            className="text-gray-500"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "11px",
                            }}
                          >
                            Preview tidak tersedia untuk tipe file ini. File
                            siap untuk dianalisis.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* File Actions */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreview(null);
                      const input = document.getElementById(
                        "file-input"
                      ) as HTMLInputElement;
                      if (input) input.value = "";
                    }}
                    className="flex-1 bg-gray-100 text-hijautua font-medium py-3 rounded-full hover:bg-gray-200 transition-colors"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    Hapus File
                  </button>
                  <button
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                    className="flex-1 border border-hijautua text-hijautua font-medium py-3 rounded-full hover:bg-hijautua hover:text-white transition-colors"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    Pilih Lain
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Area */
              <div
                className={`relative cursor-pointer transition-all duration-300 ${
                  isDragOver
                    ? "border-hijauterang bg-hijaumuda/20"
                    : "border-gray-400"
                }`}
                style={{
                  width: "100%",
                  maxWidth: "361px",
                  height: "167px",
                  borderRadius: "10px",
                  border: "1px dashed #606060",
                  backgroundColor: "#E4EBED",
                  margin: "0 auto",
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <div className="flex flex-col items-center justify-center h-full px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#213813"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-3"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    <path d="M12 11v6" />
                    <path d="M9 14l3-3 3 3" />
                  </svg>
                  <p
                    className="text-hijautua text-center font-medium whitespace-nowrap"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    Ambil foto atau Pilih berkas untuk diunggah
                  </p>
                  <p
                    className="text-gray-600 text-center mt-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "10px",
                    }}
                  >
                    Pilih JPG, PNG, PDF, atau DOCX hingga 5MB
                  </p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-8 mb-8">
              <button
                onClick={handleAnalysis}
                disabled={!selectedFile}
                className={`w-full bg-gradient-hijau text-white font-medium py-4 rounded-full transition-all duration-300 ${
                  selectedFile
                    ? "hover:opacity-90 hover:scale-105"
                    : "opacity-50 cursor-not-allowed"
                }`}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  height: "56px",
                }}
              >
                Lanjutkan Analisis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - New Design */}
      <div className="hidden lg:flex min-h-screen bg-gradient-to-br from-hijautua/5 via-hijauterang/5 to-gray-100">
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-hijauterang/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-hijautua/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full flex items-center justify-center p-8 relative z-10">
          <div className="max-w-7xl w-full">
            {/* Back Button - Desktop */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-3 mb-8 text-hijautua hover:text-hijauterang transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center group-hover:shadow-xl group-hover:scale-105 transition-all border border-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </div>
              <span
                className="font-semibold text-xl"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Kembali ke Dashboard
              </span>
            </button>

            {/* Main Card Container */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border border-gray-100">
              <div className="grid grid-cols-2 gap-0 min-h-[700px]">
                {/* Left Side - Info & Upload */}
                <div className="p-12 bg-gradient-hijau text-white flex flex-col justify-between">
                  <div>
                    <h1
                      className="text-4xl font-bold mb-6"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Unggah Penawaran Kerjamu
                    </h1>
                    <p
                      className="text-lg opacity-90 mb-8 leading-relaxed"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Untuk melanjutkan, silakan unggah atau ambil foto surat
                      penawaran atau kontrak kerjamu. AI kami akan menganalisis
                      dokumen Anda dengan cepat dan akurat.
                    </p>

                    {/* Features List */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div>
                          <p
                            className="font-medium text-base"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            Analisis Otomatis dengan AI
                          </p>
                          <p
                            className="text-sm opacity-80 mt-1"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            Sistem akan mengidentifikasi detail penting dalam
                            dokumen
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div>
                          <p
                            className="font-medium text-base"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            Keamanan Data Terjamin
                          </p>
                          <p
                            className="text-sm opacity-80 mt-1"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            Dokumen Anda diproses dengan enkripsi end-to-end
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div>
                          <p
                            className="font-medium text-base"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            Hasil Instan
                          </p>
                          <p
                            className="text-sm opacity-80 mt-1"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            Dapatkan hasil analisis dalam hitungan detik
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* File Types Supported */}
                  <div className="pt-8 border-t border-white/20">
                    <p
                      className="text-sm opacity-80 mb-3"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Format file yang didukung:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["JPG", "PNG", "PDF", "DOCX"].map((format) => (
                        <span
                          key={format}
                          className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side - Upload Area & Preview */}
                <div className="p-12 bg-white flex flex-col">
                  {/* Hidden File Input */}
                  <input
                    id="file-input-desktop"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <h2
                    className="text-2xl font-semibold text-hijautua mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {selectedFile ? "Preview Dokumen" : "Upload Dokumen"}
                  </h2>

                  {selectedFile ? (
                    /* File Preview - Desktop */
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1 border-2 border-gray-200 rounded-2xl overflow-hidden bg-gray-50 mb-6">
                        {isPreviewLoading ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-hijautua mx-auto mb-4"></div>
                              <p className="text-gray-600 text-lg">
                                Memuat preview...
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {getFileType(selectedFile) === "image" &&
                              filePreview && (
                                <div className="h-full overflow-auto">
                                  <img
                                    src={filePreview}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}

                            {getFileType(selectedFile) === "pdf" &&
                              filePreview && (
                                <iframe
                                  src={filePreview}
                                  className="w-full h-full border-0"
                                  title="PDF Preview"
                                />
                              )}

                            {(getFileType(selectedFile) === "document" ||
                              getFileType(selectedFile) === "other") && (
                              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="80"
                                  height="80"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#213813"
                                  strokeWidth="1.5"
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
                                <h4
                                  className="text-hijautua font-semibold text-xl mb-3"
                                  style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                  {selectedFile.name}
                                </h4>
                                <p
                                  className="text-gray-600 mb-4 text-base"
                                  style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                  Ukuran:{" "}
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </p>
                                <p
                                  className="text-gray-500 text-sm"
                                  style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                  Preview tidak tersedia untuk tipe file ini.
                                  <br />
                                  File siap untuk dianalisis.
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* File Actions - Desktop */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setFilePreview(null);
                            const input = document.getElementById(
                              "file-input-desktop"
                            ) as HTMLInputElement;
                            if (input) input.value = "";
                          }}
                          className="bg-gray-100 text-hijautua font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "16px",
                          }}
                        >
                          Hapus File
                        </button>
                        <button
                          onClick={() =>
                            document
                              .getElementById("file-input-desktop")
                              ?.click()
                          }
                          className="border-2 border-hijautua text-hijautua font-medium py-3 rounded-xl hover:bg-hijautua hover:text-white transition-colors"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "16px",
                          }}
                        >
                          Pilih Lain
                        </button>
                      </div>

                      {/* Analyze Button */}
                      <button
                        onClick={handleAnalysis}
                        className="bg-gradient-hijau text-white font-semibold py-4 rounded-xl hover:opacity-90 hover:shadow-lg transition-all"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "18px",
                        }}
                      >
                        Lanjutkan Analisis →
                      </button>
                    </div>
                  ) : (
                    /* Upload Area - Desktop */
                    <div
                      className={`flex-1 relative cursor-pointer transition-all duration-300 rounded-2xl border-3 ${
                        isDragOver
                          ? "border-hijauterang bg-hijauterang/10 scale-[0.98]"
                          : "border-dashed border-gray-300 bg-gray-50 hover:border-hijautua hover:bg-hijautua/5"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("file-input-desktop")?.click()
                      }
                    >
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                        <div
                          className={`w-20 h-20 rounded-2xl ${
                            isDragOver ? "bg-hijauterang" : "bg-hijautua"
                          } flex items-center justify-center mb-6 transition-colors`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <h3
                          className="text-2xl font-semibold text-hijautua mb-3"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {isDragOver
                            ? "Lepaskan file di sini"
                            : "Drag & Drop atau Klik untuk Upload"}
                        </h3>
                        <p
                          className="text-gray-600 text-base mb-6"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Pilih file dari komputer Anda atau drag file ke area
                          ini
                        </p>
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-hijautua text-hijautua rounded-xl font-medium hover:bg-hijautua hover:text-white transition-colors">
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
                          <span style={{ fontFamily: "Poppins, sans-serif" }}>
                            Pilih File
                          </span>
                        </div>
                        <p
                          className="text-gray-500 text-sm mt-4"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Maksimal ukuran file: 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
