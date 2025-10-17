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

    if (file.type.startsWith("image/")) {
      // For images, create object URL
      const imageUrl = URL.createObjectURL(file);
      setFilePreview(imageUrl);
      setIsPreviewLoading(false);
    } else if (file.type === "application/pdf") {
      // For PDFs, we'll use object URL and display in iframe
      const pdfUrl = URL.createObjectURL(file);
      setFilePreview(pdfUrl);
      setIsPreviewLoading(false);
    } else {
      // For other document types, show document info
      setFilePreview(null);
      setIsPreviewLoading(false);
    }
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
      // Navigate to analysis page or show analysis results
      console.log("Starting analysis for:", selectedFile.name);
      // router.push("/analysis");
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
                      <p className="text-gray-600 text-sm">Memuat preview...</p>
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
                          Ukuran: {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                        <p
                          className="text-gray-500"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "11px",
                          }}
                        >
                          Preview tidak tersedia untuk tipe file ini. File siap
                          untuk dianalisis.
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
                  onClick={() => document.getElementById("file-input")?.click()}
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
  );
}
