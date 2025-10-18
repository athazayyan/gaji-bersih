"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface RegulationItem {
  id: string;
  type: string;
  number: string;
  year: string;
  title: string;
  uploadDate: string;
  status: "active" | "inactive";
  fileSize: string;
  description?: string;
}

export default function ManageRegulasiPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [regulations, setRegulations] = useState<RegulationItem[]>([
    {
      id: "1",
      type: "PP",
      number: "58",
      year: "2023",
      title: "Tentang Pajak Penghasilan",
      description: "Peraturan mengenai tarif dan mekanisme pajak penghasilan",
      uploadDate: "15 Okt 2024",
      status: "active",
      fileSize: "2.4 MB",
    },
    {
      id: "2",
      type: "UU",
      number: "11",
      year: "2020",
      title: "UU Cipta Kerja",
      description: "Undang-undang tentang cipta kerja dan ketenagakerjaan",
      uploadDate: "14 Okt 2024",
      status: "active",
      fileSize: "5.2 MB",
    },
    {
      id: "3",
      type: "Permen",
      number: "24",
      year: "2024",
      title: "Peraturan BPJS Ketenagakerjaan",
      description: "Ketentuan iuran dan manfaat BPJS",
      uploadDate: "12 Okt 2024",
      status: "active",
      fileSize: "1.8 MB",
    },
    {
      id: "4",
      type: "PMK",
      number: "102",
      year: "2023",
      title: "PMK Perpajakan Terbaru",
      description: "Peraturan Menteri Keuangan tentang perpajakan",
      uploadDate: "10 Okt 2024",
      status: "active",
      fileSize: "3.1 MB",
    },
    {
      id: "5",
      type: "PP",
      number: "36",
      year: "2021",
      title: "Pengupahan di Indonesia",
      description: "Peraturan tentang sistem pengupahan",
      uploadDate: "08 Okt 2024",
      status: "inactive",
      fileSize: "4.5 MB",
    },
  ]);

  const handleDelete = (id: string) => {
    setRegulations(regulations.filter((reg) => reg.id !== id));
  };

  const toggleStatus = (id: string) => {
    setRegulations(
      regulations.map((reg) =>
        reg.id === id
          ? { ...reg, status: reg.status === "active" ? "inactive" : "active" }
          : reg
      )
    );
  };

  const filteredRegulations = regulations.filter((reg) => {
    const matchesSearch =
      reg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || reg.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: "all", label: "Semua", count: regulations.length },
    {
      value: "PP",
      label: "PP",
      count: regulations.filter((r) => r.type === "PP").length,
    },
    {
      value: "UU",
      label: "UU",
      count: regulations.filter((r) => r.type === "UU").length,
    },
    {
      value: "Permen",
      label: "Permen",
      count: regulations.filter((r) => r.type === "Permen").length,
    },
    {
      value: "PMK",
      label: "PMK",
      count: regulations.filter((r) => r.type === "PMK").length,
    },
  ];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-hijautua via-hijauterang to-hijaudaun bg-clip-text text-transparent mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Kelola Regulasi
            </h1>
            <p
              className="text-hijaudaun text-base sm:text-lg"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {filteredRegulations.length} regulasi ditemukan
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/admin/upload-regulasi")}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-hijauterang to-hijaudaun text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload Baru
          </motion.button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gradient-hijau rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-hijaumuda"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari regulasi berdasarkan judul, nomor, atau jenis..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white/30 focus:border-hijaumuda focus:outline-none transition-colors text-white placeholder:text-hijaumuda bg-white/10 backdrop-blur-sm"
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <motion.button
                key={filter.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterType(filter.value)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  filterType === filter.value
                    ? "bg-white/30 text-white shadow-lg shadow-white/20"
                    : "bg-white/10 text-hijaumuda hover:bg-white/20 hover:text-white"
                }`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {filter.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    filterType === filter.value
                      ? "bg-white/40 text-white"
                      : "bg-white/20 text-hijaumuda"
                  }`}
                >
                  {filter.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Regulations Grid */}
        <AnimatePresence mode="popLayout">
          {filteredRegulations.length > 0 ? (
            <motion.div layout className="grid gap-4">
              {filteredRegulations.map((reg, index) => (
                <motion.div
                  key={reg.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="bg-gradient-hijau rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-hijautua backdrop-blur-sm flex items-center justify-center flex-shrink-0 text-2xl group-hover:scale-110 transition-transform shadow-lg mx-auto sm:mx-0">
                      📄
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-3">
                        <div className="flex-1 mb-3 sm:mb-0">
                          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 mb-2 justify-center sm:justify-start">
                            <span
                              className="px-3 py-1 rounded-lg bg-white/30 text-white text-sm font-bold shadow-md backdrop-blur-sm"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {reg.type} {reg.number}/{reg.year}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                reg.status === "active"
                                  ? "bg-green-500/20 text-green-200"
                                  : "bg-gray-500/20 text-gray-300"
                              }`}
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {reg.status === "active"
                                ? "✓ Aktif"
                                : "○ Nonaktif"}
                            </span>
                          </div>
                          <h3
                            className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-hijaumuda transition-colors"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {reg.title}
                          </h3>
                          {reg.description && (
                            <p
                              className="text-hijaumuda text-sm mb-3 line-clamp-2"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {reg.description}
                            </p>
                          )}
                          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-sm text-hijaumuda justify-center sm:justify-start">
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {reg.uploadDate}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4"
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
                              {reg.fileSize}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleStatus(reg.id)}
                          className={`w-full sm:flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                            reg.status === "active"
                              ? "bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30"
                              : "bg-green-500/20 text-green-200 hover:bg-green-500/30"
                          }`}
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {reg.status === "active" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                          {reg.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Lihat
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (
                              confirm(
                                "Apakah Anda yakin ingin menghapus regulasi ini?"
                              )
                            ) {
                              handleDelete(reg.id);
                            }
                          }}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/30 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Hapus
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-hijau rounded-2xl p-16 text-center border border-gray-200"
            >
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-hijaumuda"
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
              <h3
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Tidak ada regulasi ditemukan
              </h3>
              <p
                className="text-hijaumuda mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
                className="px-6 py-3 bg-gradient-to-r from-hijauterang to-hijaubiru text-white rounded-xl font-semibold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Reset Filter
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
