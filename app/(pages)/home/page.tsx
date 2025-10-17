"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GradientCard from "@/app/components/GradientCard";
import DocumentItem from "@/app/components/DocumentItem";

export default function HomePage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format functions
  const formatDay = (date: Date) => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return days[date.getDay()];
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours} : ${minutes}`;
  };

  const formatMonth = (date: Date) => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MEI",
      "JUN",
      "JUL",
      "AGU",
      "SEP",
      "OKT",
      "NOV",
      "DES",
    ];
    return months[date.getMonth()];
  };

  // Dummy data untuk history dengan lebih banyak data untuk scroll
  const historyDocuments = [
    "Surat Penawaran - PT Maju Jaya Sejahtera",
    "Kontrak Kerja - PT Indah Karya Abadi",
    "Surat Perjanjian - CV Sukses Bersama",
    "Dokumen Kerjasama - PT Global Teknologi",
    "Surat Penawaran - PT Cahaya Mandiri",
    "MoU Kerjasama - PT Nusantara Digital",
    "Kontrak Proyek - PT Bintang Timur",
    "Surat Perjanjian - PT Mitra Sejahtera",
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 bg-white">
      <div className="max-w-md mx-auto">
        {/* Header with greeting and avatar */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1
              className="text-hijautua font-semibold"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "28px",
                lineHeight: "1.2",
              }}
            >
              Hai 👋
            </h1>
            <h1
              className="text-hijautua font-semibold"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "28px",
                lineHeight: "1.2",
              }}
            >
              Username
            </h1>
          </div>
          <div
            className="rounded-full overflow-hidden bg-gradient-hijau flex-shrink-0"
            style={{
              width: "56px",
              height: "56px",
            }}
          >
            <Image
              src="/dummy/dummyProfil.png"
              alt="Profile"
              width={56}
              height={56}
              className="object-cover"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>

        {/* Main Card - Cek Berkas */}
        <div className="mb-4">
          <GradientCard
            title="Cek Berkas"
            buttonText="Cek berkas mu disini"
            onClick={() => router.push("/scan")}
            width="100%"
            height="152px"
          />
        </div>

        {/* Cards Row - Lihat Riwayat & Time */}
        <div className="flex gap-3 mb-4">
          {/* Lihat Riwayat Card */}
          <div className="flex-shrink-0" style={{ width: "165px" }}>
            <GradientCard
              title="Lihat Riwayat"
              buttonText="Riwayat"
              onClick={() => router.push("/history")}
              width="165px"
              height="152px"
              titleSize="22px"
              isSmallCard={true}
            />
          </div>

          {/* Time Card */}
          <div
            className="p-3 flex flex-col justify-center items-center text-center flex-1"
            style={{
              height: "152px",
              borderRadius: "15px",
              border: "4px solid #213813",
              backgroundColor: "white",
            }}
          >
            <p
              className="font-medium italic mb-1"
              style={{
                fontSize: "20px",
                color: "#213813",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {formatDay(currentTime)}
            </p>
            <h2
              className="font-bold mb-0"
              style={{
                fontSize: "36px",
                color: "#213813",
                lineHeight: "1",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {formatTime(currentTime)}
            </h2>
            <p
              className="font-bold italic"
              style={{
                fontSize: "40px",
                color: "#213813",
                lineHeight: "1",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {formatMonth(currentTime)}
            </p>
          </div>
        </div>

        {/* Riwayat Section */}
        <div
          className="bg-gradient-hijau p-4 relative"
          style={{
            borderRadius: "15px",
            height: "400px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top Line Indicator */}
          <div
            className="bg-white mx-auto mb-4 flex-shrink-0"
            style={{
              width: "115px",
              height: "6px",
              borderRadius: "3px",
            }}
          />

          {/* Header with title and button */}
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h3
              className="text-white font-semibold"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "18px",
              }}
            >
              Riwayat
            </h3>
            <button
              onClick={() => router.push("/history")}
              className="bg-white text-hijautua px-3 py-1 rounded-full hover:opacity-90 transition-opacity"
              style={{
                width: "98px",
                height: "24px",
                fontSize: "10px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
              }}
            >
              Lihat Semua
            </button>
          </div>

          {/* Document List - Scrollable */}
          <div
            className="space-y-3 overflow-y-auto flex-1 pr-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255, 255, 255, 0.5) transparent",
            }}
          >
            {historyDocuments.map((doc, index) => (
              <DocumentItem
                key={index}
                title={doc}
                onClick={() => console.log(`Clicked: ${doc}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
