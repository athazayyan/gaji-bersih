"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SalaryDetailsPage() {
  const router = useRouter();
  const [showAmount, setShowAmount] = useState(true);

  // Mock data - replace with actual data from backend
  const salaryData = {
    gajiPokok: 8000000,
    tunjangan: {
      kesehatan: 500000,
      transport: 300000,
      makan: 400000,
      jabatan: 1000000,
    },
    totalTunjangan: 2200000,
    totalKotor: 10200000,
    potongan: {
      bpjsKesehatan: 100000,
      bpjsKetenagakerjaan: 200000,
      pph21: 850000,
      lainnya: 200000,
    },
    totalPotongan: 1350000,
    gajiBersih: 8850000,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  const DetailItem = ({
    label,
    amount,
    isSubItem = false,
  }: {
    label: string;
    amount: number;
    isSubItem?: boolean;
  }) => (
    <div
      className={`flex justify-between items-center ${
        isSubItem ? "pl-4" : ""
      } py-2`}
    >
      <span
        className={`${
          isSubItem
            ? "text-sm text-gray-600"
            : "text-sm font-medium text-gray-800"
        }`}
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {label}
      </span>
      <span
        className={`${
          isSubItem
            ? "text-sm text-gray-700"
            : "text-sm font-semibold text-gray-900"
        }`}
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {showAmount ? `Rp ${formatCurrency(amount)}` : "Rp ****"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-gray-50 lg:via-green-50/30 lg:to-emerald-50/40 pb-6 overflow-x-hidden relative">
      {/* Desktop Background Decorations */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top right circle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-hijauterang/20 to-hijaumuda/10 rounded-full blur-3xl"></div>

        {/* Bottom left circle */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-hijautua/10 to-hijauterang/10 rounded-full blur-3xl"></div>

        {/* Center accent */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-green-100/20 to-transparent rounded-full blur-3xl"></div>

        {/* Floating shapes */}
        <div className="absolute top-20 right-1/4 w-32 h-32 bg-hijauterang/10 rounded-2xl rotate-12 blur-2xl"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-hijaumuda/10 rounded-full blur-2xl"></div>
      </div>

      {/* Desktop Container */}
      <div className="lg:max-w-7xl lg:mx-auto lg:px-8 lg:py-12 relative z-10 lg:min-h-screen lg:flex lg:items-center">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8 lg:w-full">
          {/* LEFT: Summary Card - Desktop Only */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 sticky top-8">
              {/* Back Button Desktop */}
              <button
                onClick={() => router.back()}
                className="flex items-center gap-3 mb-6 text-hijautua hover:text-hijauterang transition-colors"
              >
                <div className="bg-hijautua/10 hover:bg-hijautua/20 rounded-full p-2 transition-colors">
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
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                </div>
                <span
                  className="font-medium"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kembali
                </span>
              </button>

              <h2
                className="text-hijautua font-bold text-2xl mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Ringkasan Gaji
              </h2>

              {/* Gaji Bersih Large Display */}
              <div className="bg-gradient-hijau rounded-2xl p-6 mb-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <p
                    className="text-sm opacity-90"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Total Gaji Bersih
                  </p>
                  <button
                    onClick={() => setShowAmount(!showAmount)}
                    className="text-white transition-transform hover:scale-110 active:scale-95"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {showAmount ? (
                        <path
                          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                          fill="white"
                        />
                      ) : (
                        <path
                          d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                          fill="white"
                        />
                      )}
                    </svg>
                  </button>
                </div>
                <h2
                  className="text-5xl font-bold mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {showAmount
                    ? `Rp ${formatCurrency(salaryData.gajiBersih)}`
                    : "Rp ****"}
                </h2>
                <p
                  className="text-xs opacity-80"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  per Bulan
                </p>
              </div>

              {/* Quick Summary */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Total Penghasilan
                  </span>
                  <span
                    className="text-sm font-semibold text-green-600"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {showAmount
                      ? `Rp ${formatCurrency(salaryData.totalKotor)}`
                      : "Rp ****"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Total Potongan
                  </span>
                  <span
                    className="text-sm font-semibold text-red-600"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {showAmount
                      ? `Rp ${formatCurrency(salaryData.totalPotongan)}`
                      : "Rp ****"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span
                    className="text-base font-semibold text-gray-900"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Gaji Bersih
                  </span>
                  <span
                    className="text-lg font-bold text-hijautua"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {showAmount
                      ? `Rp ${formatCurrency(salaryData.gajiBersih)}`
                      : "Rp ****"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Details Section */}
          <div className="lg:col-span-3">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h1
                className="text-hijautua font-bold text-4xl mb-3"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Rincian Gaji & Potongan
              </h1>
              <p
                className="text-gray-600 text-base"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Detail lengkap komponen gaji, tunjangan, dan potongan Anda
              </p>
            </div>

            {/* Desktop Bento Grid */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:mb-8">
              {/* Gaji Pokok Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center mb-4">
                  <div className="bg-hijauterang/10 p-3 rounded-xl mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2f9e74"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <h3
                    className="text-hijautua font-semibold text-lg"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Gaji Pokok
                  </h3>
                </div>
                <p
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {showAmount
                    ? `Rp ${formatCurrency(salaryData.gajiPokok)}`
                    : "Rp ****"}
                </p>
              </div>

              {/* Tunjangan Card - Spans 2 columns */}
              <div className="lg:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl border border-green-200 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-green-500 p-3 rounded-xl mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <h3
                      className="text-hijautua font-semibold text-xl"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Tunjangan
                    </h3>
                  </div>
                  <span
                    className="text-green-600 font-bold text-lg"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    +{" "}
                    {showAmount
                      ? `Rp ${formatCurrency(salaryData.totalTunjangan)}`
                      : "Rp ****"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <p
                      className="text-xs text-gray-600 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Kesehatan
                    </p>
                    <p
                      className="text-lg font-semibold text-gray-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {showAmount
                        ? `Rp ${formatCurrency(salaryData.tunjangan.kesehatan)}`
                        : "Rp ****"}
                    </p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <p
                      className="text-xs text-gray-600 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Transport
                    </p>
                    <p
                      className="text-lg font-semibold text-gray-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {showAmount
                        ? `Rp ${formatCurrency(salaryData.tunjangan.transport)}`
                        : "Rp ****"}
                    </p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <p
                      className="text-xs text-gray-600 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Makan
                    </p>
                    <p
                      className="text-lg font-semibold text-gray-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {showAmount
                        ? `Rp ${formatCurrency(salaryData.tunjangan.makan)}`
                        : "Rp ****"}
                    </p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <p
                      className="text-xs text-gray-600 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Jabatan
                    </p>
                    <p
                      className="text-lg font-semibold text-gray-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {showAmount
                        ? `Rp ${formatCurrency(salaryData.tunjangan.jabatan)}`
                        : "Rp ****"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Kotor Card */}
              <div className="lg:col-span-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p
                      className="text-sm opacity-90 mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Total Gaji Kotor
                    </p>
                    <p
                      className="text-4xl font-bold"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {showAmount
                        ? `Rp ${formatCurrency(salaryData.totalKotor)}`
                        : "Rp ****"}
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Potongan Card - Spans 2 columns */}
              <div className="lg:col-span-2 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-xl border border-red-200 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-red-500 p-3 rounded-xl mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="2" x2="12" y2="22" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <h3
                      className="text-red-900 font-semibold text-xl"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Potongan
                    </h3>
                  </div>
                  <span
                    className="text-red-600 font-bold text-lg"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    -{" "}
                    {showAmount
                      ? `Rp ${formatCurrency(salaryData.totalPotongan)}`
                      : "Rp ****"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <p
                      className="text-xs text-gray-600 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      BPJS Kesehatan
                    </p>
                    <p
                      className="text-lg font-semibold text-gray-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {showAmount
                        ? `Rp ${formatCurrency(
                            salaryData.potongan.bpjsKesehatan
                          )}`
                        : "Rp ****"}
                    </p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <p
                      className="text-xs text-gray-600 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      BPJS Ketenagakerjaan
                    </p>
                    <p
                      className="text-lg font-semibold text-gray-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {showAmount
                        ? `Rp ${formatCurrency(
                            salaryData.potongan.bpjsKetenagakerjaan
                          )}`
                        : "Rp ****"}
                    </p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <p
                      className="text-xs text-gray-600 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      PPh 21
                    </p>
                    <p
                      className="text-lg font-semibold text-gray-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {showAmount
                        ? `Rp ${formatCurrency(salaryData.potongan.pph21)}`
                        : "Rp ****"}
                    </p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <p
                      className="text-xs text-gray-600 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Lainnya
                    </p>
                    <p
                      className="text-lg font-semibold text-gray-900"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {showAmount
                        ? `Rp ${formatCurrency(salaryData.potongan.lainnya)}`
                        : "Rp ****"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header Section with Gradient */}
      <div
        className="bg-gradient-hijau relative lg:hidden"
        style={{
          width: "100%",
          maxWidth: "414px",
          height: "160px",
          borderRadius: "0 0 30px 30px",
          margin: "0 auto",
        }}
      >
        <div className="px-6 pt-12 pb-6 flex flex-col justify-center h-full">
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
            className="text-white font-bold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "22px",
              lineHeight: "1.2",
            }}
          >
            Rincian Gaji & Potongan
          </h1>
        </div>
      </div>

      {/* Mobile Content Section */}
      <div className="px-6 pt-6 lg:hidden">
        <div className="max-w-md mx-auto">
          {/* Gaji Bersih Card - Main Result */}
          <div className="mb-4">
            <div
              className="relative p-6 text-white w-full bg-gradient-hijau"
              style={{
                height: "140px",
                borderRadius: "15px",
                maxWidth: "365px",
                margin: "0 auto",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-sm font-normal"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Total Gaji Bersih per Bulan
                </p>
                {/* Hide/Show Button */}
                <button
                  onClick={() => setShowAmount(!showAmount)}
                  className="text-white transition-transform active:scale-95"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {showAmount ? (
                      <path
                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                        fill="white"
                      />
                    ) : (
                      <path
                        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                        fill="white"
                      />
                    )}
                  </svg>
                </button>
              </div>
              <h2
                className="text-4xl font-bold mb-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {showAmount
                  ? `Rp ${formatCurrency(salaryData.gajiBersih)}`
                  : "Rp ****"}
              </h2>
              <p
                className="text-xs text-white/80"
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Sudah termasuk semua tunjangan dan potongan
              </p>
            </div>
          </div>

          {/* Gaji Pokok Card */}
          <div className="mb-4">
            <div
              className="bg-white rounded-xl p-5 w-full"
              style={{
                maxWidth: "365px",
                margin: "0 auto",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: "1px solid #E0E0E0",
              }}
            >
              <div className="flex items-center mb-3">
                <div
                  className="bg-hijauterang/10 p-2 rounded-lg mr-3"
                  style={{ width: "36px", height: "36px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2f9e74"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <h3
                  className="text-hijautua font-semibold"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  Gaji Pokok
                </h3>
              </div>
              <p
                className="text-2xl font-bold text-gray-900 ml-12"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {showAmount
                  ? `Rp ${formatCurrency(salaryData.gajiPokok)}`
                  : "Rp ****"}
              </p>
            </div>
          </div>

          {/* Tunjangan Card */}
          <div className="mb-4">
            <div
              className="bg-white rounded-xl p-5 w-full"
              style={{
                maxWidth: "365px",
                margin: "0 auto",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: "1px solid #E0E0E0",
              }}
            >
              <div className="flex items-center mb-3">
                <div
                  className="bg-green-100 p-2 rounded-lg mr-3"
                  style={{ width: "36px", height: "36px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3
                  className="text-hijautua font-semibold flex-1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  Tunjangan
                </h3>
                <span
                  className="text-green-600 font-bold text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  +{" "}
                  {showAmount
                    ? `Rp ${formatCurrency(salaryData.totalTunjangan)}`
                    : "Rp ****"}
                </span>
              </div>
              <div className="ml-12 space-y-1 border-l-2 border-green-200 pl-4">
                <DetailItem
                  label="Tunjangan Kesehatan"
                  amount={salaryData.tunjangan.kesehatan}
                  isSubItem
                />
                <DetailItem
                  label="Tunjangan Transport"
                  amount={salaryData.tunjangan.transport}
                  isSubItem
                />
                <DetailItem
                  label="Tunjangan Makan"
                  amount={salaryData.tunjangan.makan}
                  isSubItem
                />
                <DetailItem
                  label="Tunjangan Jabatan"
                  amount={salaryData.tunjangan.jabatan}
                  isSubItem
                />
              </div>
            </div>
          </div>

          {/* Total Kotor Card */}
          <div className="mb-4">
            <div
              className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 w-full border-2 border-blue-200"
              style={{
                maxWidth: "365px",
                margin: "0 auto",
              }}
            >
              <div className="flex justify-between items-center">
                <span
                  className="text-blue-900 font-semibold"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "15px",
                  }}
                >
                  Total Gaji Kotor
                </span>
                <span
                  className="text-blue-900 font-bold text-lg"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {showAmount
                    ? `Rp ${formatCurrency(salaryData.totalKotor)}`
                    : "Rp ****"}
                </span>
              </div>
            </div>
          </div>

          {/* Potongan Card */}
          <div className="mb-4">
            <div
              className="bg-white rounded-xl p-5 w-full"
              style={{
                maxWidth: "365px",
                margin: "0 auto",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: "1px solid #E0E0E0",
              }}
            >
              <div className="flex items-center mb-3">
                <div
                  className="bg-red-100 p-2 rounded-lg mr-3"
                  style={{ width: "36px", height: "36px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3
                  className="text-hijautua font-semibold flex-1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  Potongan
                </h3>
                <span
                  className="text-red-600 font-bold text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  -{" "}
                  {showAmount
                    ? `Rp ${formatCurrency(salaryData.totalPotongan)}`
                    : "Rp ****"}
                </span>
              </div>
              <div className="ml-12 space-y-1 border-l-2 border-red-200 pl-4">
                <DetailItem
                  label="BPJS Kesehatan"
                  amount={salaryData.potongan.bpjsKesehatan}
                  isSubItem
                />
                <DetailItem
                  label="BPJS Ketenagakerjaan"
                  amount={salaryData.potongan.bpjsKetenagakerjaan}
                  isSubItem
                />
                <DetailItem
                  label="PPh 21"
                  amount={salaryData.potongan.pph21}
                  isSubItem
                />
                <DetailItem
                  label="Potongan Lainnya"
                  amount={salaryData.potongan.lainnya}
                  isSubItem
                />
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="mb-6">
            <div
              className="bg-gradient-hijau rounded-xl p-5 w-full text-white"
              style={{
                maxWidth: "365px",
                margin: "0 auto",
              }}
            >
              <h3
                className="text-sm font-medium mb-4 opacity-90"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Ringkasan
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Total Penghasilan
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {showAmount
                      ? `Rp ${formatCurrency(salaryData.totalKotor)}`
                      : "Rp ****"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Total Potongan
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {showAmount
                      ? `Rp ${formatCurrency(salaryData.totalPotongan)}`
                      : "Rp ****"}
                  </span>
                </div>
                <div className="border-t border-white/30 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span
                      className="text-base font-semibold"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Gaji Bersih
                    </span>
                    <span
                      className="text-xl font-bold"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {showAmount
                        ? `Rp ${formatCurrency(salaryData.gajiBersih)}`
                        : "Rp ****"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6 mb-4">
            <button
              onClick={() => router.back()}
              className="w-full bg-white border-2 border-hijautua text-hijautua font-medium rounded-full transition-all duration-300 hover:bg-hijautua hover:text-white"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
                height: "56px",
                padding: "0 24px",
              }}
            >
              Kembali ke Hasil Analisis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
