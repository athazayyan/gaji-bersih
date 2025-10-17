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
    <div className="min-h-screen bg-white pb-6 overflow-x-hidden">
      {/* Header Section with Gradient */}
      <div
        className="bg-gradient-hijau relative"
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

      {/* Content Section */}
      <div className="px-6 pt-6">
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
