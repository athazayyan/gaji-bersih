"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import GradientCard from "@/app/components/GradientCard";
import DocumentItem from "@/app/components/DocumentItem";
import HorizontalNavbar from "@/app/components/HorizontalNavbar";
import { supabase } from "@/lib/supabase/client";


 interface UserProfile {
    full_name: string;
    avatar_path: string | null;
  }

export default function HomePage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [data, setData] = useState<UserProfile | null>(null);

 

   const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, avatar_path")
          .eq("id", user.id)
          .single();
  
        // Convert avatar_path to full public URL if it exists
        if (data && data.avatar_path) {
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(data.avatar_path);
  
          return {
            full_name: data.full_name,
            avatar_path: urlData.publicUrl,
          };
        }
  
        return data;
      }
      return null;
    };
  
    useEffect(() => {
      fetchUserProfile().then((result) => {
        // Only set data if result is a valid user profile object
        if (
          result &&
          typeof result === "object" &&
          "full_name" in result &&
          "avatar_path" in result
        ) {
          setData(result as UserProfile);
        } else {
          setData(null);
        }
      });
  
      // Update time every second
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer); // Clear the timer on component unmount
    }, []); // Closing the useEffect hook properly

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
    <>
      {/* Desktop Navbar */}
      <HorizontalNavbar />

      {/* Mobile Layout - Unchanged */}
      <div className="min-h-screen pb-24 px-4 pt-8 bg-white lg:hidden">
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
                {data?.full_name}!
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
                src={data?.avatar_path || "/dummy/dummyProfil.png"}
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
              onClick={() => router.push("/home/uploadBerkas")}
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

      {/* Desktop Layout - Bento Grid */}
      <div className="hidden lg:block min-h-screen bg-white pt-24">
        <div className="max-w-7xl mx-auto p-8">
          {/* Desktop Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-hijautua mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Selamat Datang, {data?.full_name}!
            </h1>
            <p
              className="text-hijautua opacity-70 text-lg"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Mari analisis dokumen Anda dengan AI terdepan
            </p>
          </div>

          {/* Bento Grid Layout - Minimalist */}
          <div className="grid grid-cols-12 gap-6 auto-rows-[200px]">
            {/* Main Action Card - Cek Berkas - Spans 2 rows */}
            <div className="col-span-7 row-span-2">
              <div className="h-full bg-gradient-hijau rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Background decorative elements */}
                <div className="absolute top-6 right-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-6 left-6 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>

                {/* Scanning Animation - Full height */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20 rounded-3xl"
                  initial={{ y: "-100%" }}
                  animate={{ y: "100%" }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                  }}
                  style={{
                    pointerEvents: "none",
                  }}
                />

                <div className="relative z-10">
                  <h2
                    className="text-white font-bold text-4xl mb-4"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Cek Berkas
                  </h2>
                  <p
                    className="text-white opacity-90 text-lg mb-8"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Upload dan analisis kontrak kerja, surat perjanjian, atau
                    dokumen penting lainnya dengan teknologi AI terdepan
                  </p>
                </div>

                <button
                  onClick={() => router.push("/home/uploadBerkas")}
                  className="bg-white text-hijautua px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-opacity-90 transition-all w-fit shadow-md hover:shadow-lg relative z-10"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Cek berkas mu disini
                </button>
              </div>
            </div>

            {/* Time Widget - Same size as AI Analysis */}
            <div className="col-span-5 row-span-2">
              <div className="h-full bg-white rounded-3xl p-6 border-4 border-hijautua flex flex-col justify-center items-center text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                <p
                  className="font-medium italic text-hijautua text-2xl mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {formatDay(currentTime)}
                </p>
                <h2
                  className="font-bold text-hijautua text-7xl mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {formatTime(currentTime)}
                </h2>
                <p
                  className="font-bold italic text-hijautua text-5xl"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {formatMonth(currentTime)}
                </p>
              </div>
            </div>

            {/* Recent Documents */}
            <div className="col-span-7 row-span-2">
              <div className="h-full bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3
                    className="text-hijautua font-semibold text-2xl"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Dokumen Terbaru
                  </h3>
                  <button
                    onClick={() => router.push("/history")}
                    className="text-hijautua hover:text-hijauterang text-sm font-medium flex items-center gap-1"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Lihat Semua
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>

                <div
                  className="space-y-3 overflow-y-auto h-[calc(100%-60px)] pr-2"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#213813 #f3f4f6",
                  }}
                >
                  {historyDocuments.slice(0, 8).map((doc, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                      onClick={() => console.log(`Clicked: ${doc}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-hijau rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
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
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14,2 14,8 20,8" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-hijautua font-medium text-sm truncate"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {doc}
                          </p>
                          <p
                            className="text-gray-500 text-xs"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            Dianalisis {index + 1} hari yang lalu
                          </p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-400 group-hover:text-hijautua transition-colors"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings Quick Access */}
            <div className="col-span-5 row-span-2">
              <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
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
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>

                  <h3
                    className="text-white font-semibold text-2xl mb-3"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Pengaturan
                  </h3>
                  <p
                    className="text-gray-300 text-sm mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Kelola profil, preferensi, dan keamanan akun Anda
                  </p>
                </div>

                <button
                  onClick={() => router.push("/settings")}
                  className="bg-white text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-opacity-90 transition-all w-full shadow-md relative z-10"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Buka Pengaturan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};