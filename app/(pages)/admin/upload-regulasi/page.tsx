"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ModernFileUpload from "@/app/components/ModernFileUpload";

export default function UploadRegulasiPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [regulationType, setRegulationType] = useState("peraturan-pemerintah");
  const [regulationNumber, setRegulationNumber] = useState("");
  const [regulationYear, setRegulationYear] = useState("");
  const [regulationTitle, setRegulationTitle] = useState("");
  const [regulationDescription, setRegulationDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const regulationTypes = [
    {
      value: "peraturan-pemerintah",
      label: "Peraturan Pemerintah (PP)",
      icon: "📋",
    },
    { value: "undang-undang", label: "Undang-Undang (UU)", icon: "📜" },
    { value: "peraturan-menteri", label: "Peraturan Menteri", icon: "📄" },
    { value: "peraturan-daerah", label: "Peraturan Daerah", icon: "🏛️" },
    { value: "keputusan-presiden", label: "Keputusan Presiden", icon: "🎖️" },
    { value: "lainnya", label: "Lainnya", icon: "📑" },
  ];

  const handleUpload = async () => {
    if (
      !selectedFile ||
      !regulationNumber ||
      !regulationYear ||
      !regulationTitle
    ) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload with progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      setUploadSuccess(true);

      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    }, 2500);
  };

  const isFormValid =
    selectedFile && regulationNumber && regulationYear && regulationTitle;

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-hijautua via-hijauterang to-hijaudaun bg-clip-text text-transparent mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Upload Regulasi Baru
          </h1>
          <p
            className="text-hijaudaun text-lg"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Tambahkan dokumen regulasi terbaru ke dalam sistem
          </p>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className="text-green-900 font-semibold text-lg flex items-center gap-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Upload Berhasil!
                  </h3>
                  <p
                    className="text-green-700 text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Regulasi berhasil ditambahkan. Mengalihkan ke dashboard...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - File Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6 order-2 lg:order-1"
          >
            <div className="bg-gradient-hijau rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2
                className="text-xl font-bold text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <svg
                  className="w-6 h-6 text-hijaumuda"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Dokumen Regulasi
              </h2>
              <ModernFileUpload
                onFileSelect={setSelectedFile}
                accept=".pdf,.doc,.docx"
              />
            </div>

            {/* Type Selection */}
            <div className="bg-gradient-hijau rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2
                className="text-xl font-bold text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <svg
                  className="w-6 h-6 text-hijaumuda"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Jenis Regulasi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {regulationTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRegulationType(type.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      regulationType === type.value
                        ? "border-hijaumuda bg-white/20 shadow-lg shadow-white/20"
                        : "border-white/30 hover:border-hijaumuda hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <span
                        className={`font-semibold text-sm ${
                          regulationType === type.value
                            ? "text-white"
                            : "text-hijaumuda"
                        }`}
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {type.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 order-1 lg:order-2"
          >
            <div className="bg-gradient-hijau rounded-2xl p-6 shadow-lg border border-gray-100 space-y-6">
              <h2
                className="text-xl font-bold text-white flex items-center gap-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <svg
                  className="w-6 h-6 text-hijaumuda"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Detail Regulasi
              </h2>

              {/* Number and Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-semibold text-white mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Nomor Regulasi *
                  </label>
                  <input
                    type="text"
                    value={regulationNumber}
                    onChange={(e) => setRegulationNumber(e.target.value)}
                    placeholder="58"
                    className="w-full px-4 py-3 rounded-xl border-2 border-white/30 focus:border-hijaumuda focus:outline-none transition-colors bg-white/10 text-white placeholder:text-hijaumuda backdrop-blur-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold text-white mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Tahun *
                  </label>
                  <input
                    type="text"
                    value={regulationYear}
                    onChange={(e) => setRegulationYear(e.target.value)}
                    placeholder="2023"
                    className="w-full px-4 py-3 rounded-xl border-2 border-white/30 focus:border-hijaumuda focus:outline-none transition-colors bg-white/10 text-white placeholder:text-hijaumuda backdrop-blur-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label
                  className="block text-sm font-semibold text-white mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Judul Regulasi *
                </label>
                <input
                  type="text"
                  value={regulationTitle}
                  onChange={(e) => setRegulationTitle(e.target.value)}
                  placeholder="Tentang Pajak Penghasilan"
                  className="w-full px-4 py-3 rounded-xl border-2 border-white/30 focus:border-hijaumuda focus:outline-none transition-colors bg-white/10 text-white placeholder:text-hijaumuda backdrop-blur-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  className="block text-sm font-semibold text-white mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Deskripsi (Opsional)
                </label>
                <textarea
                  value={regulationDescription}
                  onChange={(e) => setRegulationDescription(e.target.value)}
                  placeholder="Deskripsi singkat tentang regulasi ini..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border-2 border-white/30 focus:border-hijaumuda focus:outline-none transition-colors resize-none bg-white/10 text-white placeholder:text-hijaumuda backdrop-blur-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="text-hijaumuda font-semibold"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Mengupload...
                    </span>
                    <span
                      className="text-white font-bold"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-gradient-to-r from-hijauterang to-hijaudaun"
                    />
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <motion.button
                whileHover={isFormValid && !isUploading ? { scale: 1.02 } : {}}
                whileTap={isFormValid && !isUploading ? { scale: 0.98 } : {}}
                onClick={handleUpload}
                disabled={!isFormValid || isUploading || uploadSuccess}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isFormValid && !isUploading && !uploadSuccess
                    ? "bg-gradient-to-r from-hijauterang via-hijaudaun to-hijaubiru text-white shadow-lg hover:shadow-xl shadow-hijauterang/30"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {isUploading
                  ? "Mengupload..."
                  : uploadSuccess
                  ? "Berhasil!"
                  : "Upload Regulasi"}
              </motion.button>

              {!isFormValid && (
                <p
                  className="text-sm text-hijaumuda text-center"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  * Lengkapi semua field yang wajib diisi
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
