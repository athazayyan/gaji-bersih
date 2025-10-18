"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HorizontalNavbar from "@/app/components/HorizontalNavbar";
import { supabase } from "@/lib/supabase/client";

interface UserProfile {
  full_name: string | null;
  avatar_path: string | null;
  email: string | null;
}

export default function SettingsPage() {
  const router = useRouter();

  const [data, setData] = useState<UserProfile | null>(null);
  const settingsCards = [
    {
      id: "profile",
      title: "Profil Saya",
      description: "Kelola informasi pribadi Anda",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      action: () => router.push("/settings/profile"),
    },
    {
      id: "security",
      title: "Keamanan",
      description: "Password dan autentikasi",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      color: "from-red-500 to-red-600",
      action: () => router.push("/settings/profile"),
    },
    {
      id: "privacy",
      title: "Privasi",
      description: "Kontrol data dan privasi Anda",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      action: () => router.push("/settings/privacy"),
    },
    {
      id: "help",
      title: "Bantuan & Dukungan",
      description: "FAQ dan hubungi kami",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      color: "from-green-500 to-green-600",
      action: () => router.push("/settings/help"),
    },
  ];

 const fetchUserProfile = async () => {
     const {
       data: { user },
     } = await supabase.auth.getUser();
     if (user) {
       const { data } = await supabase
         .from("profiles")
         .select("full_name, avatar_path, email")
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
           email: data.email,
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
   }, []);
 
  return (
    <>
      {/* Desktop Navbar */}
      <HorizontalNavbar />

      {/* Mobile Layout */}
      <div className="min-h-screen pb-24 bg-white lg:hidden">
        {/* Mobile Header with Gradient */}
        <div
          className="bg-gradient-hijau relative"
          style={{
            width: "100%",
            maxWidth: "414px",
            height: "200px",
            borderRadius: "0 0 30px 30px",
            margin: "0 auto",
          }}
        >
          <div className="px-6 pt-12 pb-6">
            <h1
              className="text-white font-bold mb-2"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "32px",
                lineHeight: "1.2",
              }}
            >
              Pengaturan
            </h1>
            <p
              className="text-white opacity-90"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                lineHeight: "1.4",
              }}
            >
              Kelola akun dan preferensi aplikasi Anda
            </p>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="px-6 pt-5">
          <div className="max-w-md mx-auto">
            {/* Profile Card */}
            <div
              className="bg-white rounded-2xl p-5 mb-5 border-2 border-gray-100"
              style={{
                filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.08))",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="rounded-full overflow-hidden bg-gradient-hijau flex-shrink-0"
                  style={{ width: "72px", height: "72px" }}
                >
                  <Image
                    src={data?.avatar_path || "/dummy/dummyProfil.png"}
                    alt="Profile"
                    width={72}
                    height={72}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2
                    className="text-hijautua font-bold mb-1"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "18px",
                    }}
                  >
                    {data?.full_name || "Username"}
                  </h2>
                  <p
                    className="text-gray-500 text-sm mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {data?.email || "atha.al.khand@gmail.com"}
                  </p>
                  <button
                    className="text-hijauterang font-semibold text-sm hover:underline"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Edit Profil
                  </button>
                </div>
              </div>
            </div>

            {/* Settings Cards Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {settingsCards.map((card) => (
                <button
                  key={card.id}
                  onClick={card.action}
                  className="bg-white rounded-2xl p-4 border-2 border-gray-100 hover:border-hijauterang transition-all active:scale-95"
                  style={{
                    filter: "drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.06))",
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-hijau rounded-xl flex items-center justify-center mb-3 text-white">
                    {card.icon}
                  </div>
                  <h4
                    className="text-hijautua font-semibold text-sm mb-1 text-left"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {card.title}
                  </h4>
                  <p
                    className="text-gray-500 text-xs text-left"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {card.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => router.push("/auth")}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 rounded-2xl hover:opacity-90 transition-all active:scale-98 mb-5"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "15px",
                filter: "drop-shadow(0px 4px 12px rgba(239, 68, 68, 0.3))",
              }}
            >
              Keluar dari Akun
            </button>

            {/* App Version */}
            <div className="text-center pb-4">
              <p
                className="text-gray-400 text-xs"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Gaji Bersih v1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 pt-24 pb-12 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-hijauterang/20 to-hijaumuda/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-hijautua/10 to-hijauterang/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-hijaumuda/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          {/* Desktop Header */}
          <div className="mb-10">
            <h1
              className="text-hijautua font-bold text-5xl mb-3"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Pengaturan
            </h1>
            <p
              className="text-gray-600 text-lg"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Kelola akun, preferensi, dan keamanan aplikasi Anda
            </p>
          </div>

          {/* Desktop Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Profile & Quick Settings */}
            <div className="col-span-4 space-y-6">
              {/* Profile Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-shadow">
                <div className="text-center">
                  <div
                    className="rounded-full overflow-hidden bg-gradient-hijau mx-auto mb-6"
                    style={{ width: "120px", height: "120px" }}
                  >
                    <Image
                      src={data?.avatar_path || "/dummy/dummyProfil.png"}
                      alt="Profile"
                      width={120}
                      height={120}
                      className="object-cover"
                    />
                  </div>
                  <h2
                    className="text-hijautua font-bold text-2xl mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {data?.full_name || "Username" }
                  </h2>
                  <p
                    className="text-gray-600 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {data?.email || "user@email.com"}
           </p>
                  <button
                    className="bg-gradient-hijau text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all font-semibold w-full"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Edit Profil
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-hijau rounded-3xl shadow-xl p-6">
                <h3
                  className="text-white font-semibold text-lg mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Statistik Akun
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-white/90 text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Dokumen Dianalisis
                    </span>
                    <span
                      className="text-white font-bold text-xl"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      12
                    </span>
                  </div>
                  <div className="border-t border-white/20"></div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-white/90 text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Konsultasi AI
                    </span>
                    <span
                      className="text-white font-bold text-xl"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      8
                    </span>
                  </div>
                  <div className="border-t border-white/20"></div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-white/90 text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Bergabung Sejak
                    </span>
                    <span
                      className="text-white font-bold text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Jan 2025
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings Options */}
            <div className="col-span-8 space-y-6">
              {/* Settings Cards */}
              <div className="grid grid-cols-2 gap-6">
                {settingsCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={card.action}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:scale-105 transition-all text-left group"
                  >
                    <div className="w-16 h-16 bg-gradient-hijau rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <h4
                      className="text-hijautua font-semibold text-xl mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {card.title}
                    </h4>
                    <p
                      className="text-gray-600 text-sm mb-4"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {card.description}
                    </p>
                    <div className="flex items-center gap-2 text-hijauterang font-medium text-sm">
                      <span style={{ fontFamily: "Poppins, sans-serif" }}>
                        Kelola
                      </span>
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
                        className="group-hover:translate-x-1 transition-transform"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>

              {/* Logout Section */}
              <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-red-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="text-red-900 font-semibold text-xl mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Keluar dari Akun
                    </h3>
                    <p
                      className="text-red-700 text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Anda akan keluar dari sesi saat ini
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/auth")}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl hover:opacity-90 transition-all font-semibold flex items-center gap-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
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
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>

              {/* App Info */}
              <div className="text-center">
                <p
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Gaji Bersih v1.0.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
