"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export default function ModernFileUpload({
  onFileSelect,
  accept = ".pdf,.doc,.docx,image/*",
  maxSize = 10 * 1024 * 1024, // 10MB
  className = "",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      setError(`File terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB`);
      return false;
    }
    setError("");
    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        if (validateFile(files[0])) {
          setFile(files[0]);
          onFileSelect(files[0]);
        }
      }
    },
    [onFileSelect, maxSize]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        setFile(files[0]);
        onFileSelect(files[0]);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setError("");
  };

  return (
    <div className={className}>
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragging ? "#2f9e74" : "#e5e7eb",
          backgroundColor: isDragging ? "rgba(47, 158, 116, 0.05)" : "#ffffff",
        }}
        className="relative border-2 border-dashed rounded-2xl p-8 transition-all"
      >
        <input
          type="file"
          id="file-upload-input"
          className="hidden"
          onChange={handleChange}
          accept={accept}
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-12"
            >
              {/* Animated Icon */}
              <motion.div
                animate={{
                  y: isDragging ? -10 : [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: isDragging ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-hijauterang to-hijaubiru rounded-full blur-xl opacity-30" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-hijauterang to-hijaubiru flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </motion.div>

              <label htmlFor="file-upload-input" className="cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-hijauterang to-hijaubiru text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Pilih File
                </motion.div>
              </label>

              <p
                className="text-gray-600 text-center mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                atau drag and drop file di sini
              </p>
              <p
                className="text-gray-400 text-sm text-center"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                PDF, DOC, DOCX atau gambar (Max {maxSize / 1024 / 1024}MB)
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="file-display"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-hijauterang/10 to-hijaubiru/10 rounded-xl"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-hijauterang to-hijaubiru flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-7 h-7 text-white"
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
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-hijautua font-semibold truncate"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {file.name}
                </p>
                <p
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={removeFile}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-4 text-center"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {error}
          </motion.p>
        )}

        {/* Animated particles effect when dragging */}
        {isDragging && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-hijauterang rounded-full"
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
