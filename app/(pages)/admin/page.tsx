"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const stats = [
    {
      label: "Total Regulasi",
      value: "156",
      iconPath:
        "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      color: "from-hijauterang to-hijaudaun",
    },
    {
      label: "Upload Bulan Ini",
      value: "23",
      iconPath:
        "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
      color: "from-hijaudaun to-hijaubiru",
    },
    {
      label: "Status Aktif",
      value: "142",
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-hijauterang to-hijaumuda",
    },
    {
      label: "Pending Review",
      value: "14",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-hijautua to-hijaudaun",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-hijautua via-hijauterang to-hijaudaun bg-clip-text text-transparent"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Dashboard Admin
          </h1>
          <p
            className="text-hijaudaun text-base sm:text-lg lg:text-xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Kelola dan monitor semua regulasi perpajakan dengan mudah
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-hijau rounded-2xl p-4 lg:p-6 shadow-md hover:shadow-lg transition-all text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-hijaumuda text-sm font-medium mb-1"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl lg:text-3xl font-bold text-white"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                >
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
                      d={stat.iconPath}
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Action Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
        >
          {/* Upload Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/admin/upload-regulasi")}
            className="group relative overflow-hidden rounded-3xl p-6 lg:p-8 bg-gradient-hijau text-white cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            <div className="relative z-10 space-y-4 lg:space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <svg
                    className="w-6 h-6 lg:w-8 lg:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <svg
                  className="w-6 h-6 lg:w-8 lg:h-8 text-hijaumuda group-hover:text-white group-hover:translate-x-2 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>

              <div>
                <h3
                  className="text-xl lg:text-2xl xl:text-3xl font-bold mb-2 lg:mb-3 text-white"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Upload Regulasi
                </h3>
                <p
                  className="text-hijaumuda text-sm lg:text-base leading-relaxed"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Tambahkan dokumen regulasi perpajakan terbaru ke dalam sistem
                  untuk analisis AI
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span>Mulai Upload</span>
                <span className="w-1.5 h-1.5 bg-hijaumuda rounded-full animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Manage Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/admin/manage-regulasi")}
            className="group relative overflow-hidden rounded-3xl p-6 lg:p-8 bg-gradient-hijau text-white cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            <div className="relative z-10 space-y-4 lg:space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <svg
                    className="w-6 h-6 lg:w-8 lg:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <svg
                  className="w-6 h-6 lg:w-8 lg:h-8 text-hijaumuda group-hover:text-white group-hover:translate-x-2 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>

              <div>
                <h3
                  className="text-xl lg:text-2xl xl:text-3xl font-bold mb-2 lg:mb-3 text-white"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kelola Regulasi
                </h3>
                <p
                  className="text-hijaumuda text-sm lg:text-base leading-relaxed"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Lihat, edit, dan kelola semua dokumen regulasi yang telah
                  diupload ke sistem
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span>Lihat Semua</span>
                <span className="w-1.5 h-1.5 bg-hijaumuda rounded-full animate-pulse" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-hijau rounded-3xl p-6 lg:p-8 shadow-md hover:shadow-lg transition-all text-white"
        >
          <div className="flex items-start gap-4 lg:gap-6">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg
                className="w-6 h-6 lg:w-7 lg:h-7 text-hijauterang"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3
                className="text-xl font-bold text-white mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Tips: Kelola Regulasi dengan Efisien
              </h3>
              <p
                className="text-hijaumuda leading-relaxed mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Upload dokumen regulasi dalam format PDF, DOC, atau DOCX. Sistem
                AI kami akan otomatis menganalisis dan mengindeks konten untuk
                pencarian yang lebih cepat.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <span className="text-sm font-medium text-white">
                    PDF, DOC, DOCX
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-white">
                    Max 10 MB
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-white">
                    Terenkripsi Aman
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2
            className="text-2xl font-bold text-hijautua"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Aktivitas Terbaru
          </h2>
          <div className="grid gap-4">
            {[
              {
                action: "Upload Regulasi",
                doc: "PP No. 58 Tahun 2023",
                time: "2 jam yang lalu",
                color: "hijauterang",
                iconPath:
                  "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
              },
              {
                action: "Update Status",
                doc: "UU No. 11 Tahun 2020",
                time: "5 jam yang lalu",
                color: "hijaudaun",
                iconPath:
                  "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
              },
              {
                action: "Hapus Dokumen",
                doc: "Permen No. 15 Tahun 2022",
                time: "1 hari yang lalu",
                color: "red",
                iconPath:
                  "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
              },
            ].map((activity, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01, x: 5 }}
                className="bg-gradient-hijau rounded-2xl p-5 shadow-md hover:shadow-lg border border-white/10 hover:border-white/20 transition-all flex items-center gap-4 text-white"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    activity.color === "hijauterang"
                      ? "from-hijauterang to-hijaudaun"
                      : activity.color === "hijaudaun"
                      ? "from-hijaudaun to-hijaubiru"
                      : "from-red-500 to-red-600"
                  } flex items-center justify-center shadow-lg`}
                >
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
                      d={activity.iconPath}
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p
                    className="font-semibold text-white"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {activity.action}
                  </p>
                  <p
                    className="text-sm text-hijaumuda"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {activity.doc}
                  </p>
                </div>
                <p
                  className="text-sm text-hijaumuda/80"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {activity.time}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
