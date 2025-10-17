"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SegmentedControl from "@/app/components/SegmentedControl";
import SkeletonLoader from "@/app/components/SkeletonLoader";
import { useToast } from "@/app/components/ToastProvider";
import { supabase } from "@/lib/supabase/client";

export default function AuthenticationPage() {
  const router = useRouter();
  const toast = useToast();
  const [selectedTab, setSelectedTab] = useState(0);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [formData, setFormData] = useState({
    profilePhoto: null as File | null,
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [error, setError] = useState("");

  const tabs = ["Masuk", "Daftar"];

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // avatars bucket limit is 2MB per storage.sql
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran file maksimal 2MB");
        return;
      }

      if (
        !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        )
      ) {
        setError("Format file harus JPG, PNG, atau WEBP");
        return;
      }

      setFormData({ ...formData, profilePhoto: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLoginChange = (field: string, value: string | boolean) => {
    setLoginData({ ...loginData, [field]: value });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginData.email.trim()) {
      setError("Email wajib diisi");
      toast.error("Email wajib diisi");
      return;
    }

    if (!loginData.password) {
      setError("Kata sandi wajib diisi");
      toast.error("Kata sandi wajib diisi");
      return;
    }

    if (!loginData.rememberMe) {
      setError("Anda harus mencentang 'Ingat saya' untuk melanjutkan");
      toast.warning("Anda harus mencentang 'Ingat saya' untuk melanjutkan");
      return;
    }

    try {
      setLoginLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Gagal masuk. Coba lagi.");
        toast.error(data?.error || "Gagal masuk. Coba lagi.");
        return;
      }

      toast.success("Login berhasil! Mengalihkan ke halaman utama...");
      router.push("/home");
    } catch (err) {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
      toast.error("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error
    setError("");

    // Validate required fields
    if (!formData.profilePhoto) {
      setError("Foto profil wajib diupload");
      toast.error("Foto profil wajib diupload");
      return;
    }

    if (!formData.fullName.trim()) {
      setError("Nama lengkap wajib diisi");
      toast.error("Nama lengkap wajib diisi");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email wajib diisi");
      toast.error("Email wajib diisi");
      return;
    }

    if (!formData.password) {
      setError("Kata sandi wajib diisi");
      toast.error("Kata sandi wajib diisi");
      return;
    }

    if (formData.password.length < 6) {
      setError("Kata sandi minimal 6 karakter");
      toast.error("Kata sandi minimal 6 karakter");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi kata sandi tidak sesuai");
      toast.error("Konfirmasi kata sandi tidak sesuai");
      return;
    }

    if (!agreeTerms) {
      setError("Anda harus menyetujui syarat & kebijakan privasi");
      toast.warning("Anda harus menyetujui syarat & kebijakan privasi");
      return;
    }

    try {
      setRegisterLoading(true);
      // 1) Sign up via API
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Pendaftaran gagal. Coba lagi.");
        toast.error(data?.error || "Pendaftaran gagal. Coba lagi.");
        return;
      }

      // 2) If session exists, upload avatar and update profile
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user && formData.profilePhoto) {
        const userId = userData.user.id;
        const ext = (
          formData.profilePhoto.name.split(".").pop() || "jpg"
        ).toLowerCase();
        const filePath = `${userId}/${Date.now()}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("avatars")
          .upload(filePath, formData.profilePhoto, {
            upsert: true,
            contentType: formData.profilePhoto.type,
          });

        if (!uploadErr) {
          await fetch("/api/auth/me", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ avatar_path: filePath }),
          });
        }
      }

      if (data?.session) {
        toast.success("Pendaftaran berhasil! Selamat datang di GajiBersih");
        router.push("/home");
      } else {
        toast.info("Pendaftaran berhasil. Silakan cek email untuk verifikasi.");
        setError("Pendaftaran berhasil. Silakan cek email untuk verifikasi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
      toast.error("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Show Skeleton Loader when loading */}
      {(loginLoading || registerLoading) && (
        <SkeletonLoader
          type="auth"
          message={loginLoading ? "Memproses Login..." : "Membuat Akun Anda..."}
        />
      )}

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-hijau" />

        {/* Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header Content */}
          <div className="flex-1 flex flex-col justify-end p-6">
            <div className="text-white text-left">
              <div className="flex items-center gap-3 mb-4 mt-5">
                <img
                  src="/icon/icon-notext.svg"
                  alt="GajiBersih Icon"
                  className="w-10 h-10"
                />
                <h1
                  className="text-2xl font-semibold leading-tight"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Gabung Bersama GajiBersih
                </h1>
              </div>
              <p
                className="text-base font-light opacity-90 leading-relaxed"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Bersama GajiBersih, setiap keputusan karirmu lebih berarti. Buat
                akun dan jadilah bagian dari gerakan pekerja yang cerdas dan
                berdaya.
              </p>
            </div>
          </div>

          {/* White Rectangle Container */}
          <div
            className="bg-white px-6 pt-8 pb-12"
            style={{
              borderRadius: "40px 40px 0 0",
              height: "75vh",
              maxHeight: "75vh",
            }}
          >
            {/* Segmented Control */}
            <div className="mb-6">
              <SegmentedControl
                options={tabs}
                selectedIndex={selectedTab}
                onSelectionChange={handleTabChange}
              />
            </div>

            {/* Dynamic Form Content */}
            <div
              className="transition-all duration-300 ease-in-out h-full scrollbar-hide"
              style={{
                height: "calc(100% - 80px)",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {selectedTab === 0 ? (
                // Login Form
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div
                      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: "rgba(33, 56, 19, 1)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <svg
                          className="h-5 w-5"
                          style={{ color: "rgba(33, 56, 19, 0.5)" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) =>
                          handleLoginChange("email", e.target.value)
                        }
                        placeholder="greevo@gmail.com"
                        className="w-full pl-10 pr-4 py-3 border focus:ring-2 focus:outline-none"
                        style={{
                          borderRadius: "10px",
                          border: "1px solid #213813",
                          color: "rgba(33, 56, 19, 1)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(33, 56, 19, 1)";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(33, 56, 19, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#213813";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: "rgba(33, 56, 19, 1)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <svg
                          className="h-5 w-5"
                          style={{ color: "rgba(33, 56, 19, 0.5)" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2m0 0H9a2 2 0 00-2 2v2m0 0a2 2 0 102 2m-2-2a2 2 0 002 2m0 0V9a2 2 0 002-2m-2 2H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2"
                          />
                        </svg>
                      </div>
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) =>
                          handleLoginChange("password", e.target.value)
                        }
                        placeholder="••••••••••••••••"
                        className="w-full pl-10 pr-12 py-3 border focus:ring-2 focus:outline-none"
                        style={{
                          borderRadius: "10px",
                          border: "1px solid #213813",
                          color: "rgba(33, 56, 19, 1)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(33, 56, 19, 1)";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(33, 56, 19, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#213813";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg
                          className="h-5 w-5"
                          style={{ color: "rgba(33, 56, 19, 0.5)" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {showLoginPassword ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          ) : (
                            <svg>
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
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center mt-6">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) =>
                        handleLoginChange("rememberMe", e.target.checked)
                      }
                      className="h-4 w-4 rounded focus:ring-2 focus:outline-none"
                      style={{
                        accentColor: "rgba(33, 56, 19, 1)",
                        borderColor: "rgba(33, 56, 19, 1)",
                      }}
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 text-sm"
                      style={{
                        color: "rgba(33, 56, 19, 1)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Ingat saya
                    </label>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full text-white py-3 px-4 hover:opacity-90 transition-colors font-medium mt-8 bg-gradient-hijau disabled:opacity-60"
                    style={{
                      borderRadius: "20px",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {loginLoading ? "Memproses..." : "Masuk"}
                  </button>
                </form>
              ) : (
                // Register Form
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div
                      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {error}
                    </div>
                  )}
                  {/* Foto */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: "rgba(33, 56, 19, 1)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Foto Profil <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover border-2"
                            style={{ borderColor: "rgba(33, 56, 19, 1)" }}
                          />
                        ) : (
                          <div
                            className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center"
                            style={{ borderColor: "rgba(33, 56, 19, 0.5)" }}
                          >
                            <svg
                              className="w-10 h-10"
                              style={{ color: "rgba(33, 56, 19, 0.5)" }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                          id="profile-photo"
                        />
                        <label
                          htmlFor="profile-photo"
                          className="cursor-pointer inline-flex items-center justify-center text-sm font-medium text-white gap-2 w-full bg-gradient-hijau"
                          style={{
                            height: "36px",
                            borderRadius: "30px",
                          }}
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
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          Pilih Foto
                        </label>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "rgba(33, 56, 19, 0.6)" }}
                        >
                          JPG/PNG/WEBP, maks 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: "rgba(33, 56, 19, 1)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      placeholder="Contoh: Rina Maulida"
                      className="w-full px-4 py-3 border focus:ring-2 focus:outline-none"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #213813",
                        color: "rgba(33, 56, 19, 1)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(33, 56, 19, 1)";
                        e.target.style.boxShadow =
                          "0 0 0 2px rgba(33, 56, 19, 0.2)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#213813";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: "rgba(33, 56, 19, 1)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Contoh: rina@gmail.com"
                      className="w-full px-4 py-3 border focus:ring-2 focus:outline-none"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #213813",
                        color: "rgba(33, 56, 19, 1)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(33, 56, 19, 1)";
                        e.target.style.boxShadow =
                          "0 0 0 2px rgba(33, 56, 19, 0.2)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#213813";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgba(33, 56, 19, 1)" }}
                    >
                      Kata Sandi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        placeholder="Minimal 6 karakter"
                        className="w-full px-4 pr-12 py-3 border focus:ring-2 focus:outline-none"
                        style={{
                          borderRadius: "10px",
                          border: "1px solid #213813",
                          color: "rgba(33, 56, 19, 1)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(33, 56, 19, 1)";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(33, 56, 19, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#213813";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg
                          className="h-5 w-5"
                          style={{ color: "rgba(33, 56, 19, 0.5)" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {showPassword ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          ) : (
                            <>
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
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgba(33, 56, 19, 1)" }}
                    >
                      Konfirmasi Kata Sandi{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        placeholder="Ulangi kata sandi"
                        className="w-full px-4 pr-12 py-3 border focus:ring-2 focus:outline-none"
                        style={{
                          borderRadius: "10px",
                          border: "1px solid #213813",
                          color: "rgba(33, 56, 19, 1)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(33, 56, 19, 1)";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(33, 56, 19, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#213813";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg
                          className="h-5 w-5"
                          style={{ color: "rgba(33, 56, 19, 0.5)" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {showConfirmPassword ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          ) : (
                            <>
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
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start mt-6">
                    <input
                      id="agree-terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="h-4 w-4 rounded focus:ring-2 focus:outline-none mt-1"
                      style={{
                        accentColor: "rgba(33, 56, 19, 1)",
                        borderColor: "rgba(33, 56, 19, 1)",
                      }}
                    />
                    <label
                      htmlFor="agree-terms"
                      className="ml-2 text-sm leading-relaxed"
                      style={{
                        color: "rgba(33, 56, 19, 1)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Saya setuju dengan{" "}
                      <a
                        href="/terms"
                        className="underline hover:no-underline"
                        style={{ color: "rgba(33, 56, 19, 1)" }}
                        target="blank"
                      >
                        syarat & kebijakan privasi
                      </a>{" "}
                      GajiBersih.
                    </label>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="w-full text-white py-3 px-4 hover:opacity-90 transition-colors font-medium mt-8 bg-gradient-hijau disabled:opacity-60"
                    style={{
                      borderRadius: "20px",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {registerLoading ? "Memproses..." : "Daftar"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen bg-gradient-hijau">
        {/* Left Side - Form Section */}
        <div className="w-1/2 flex flex-col justify-center items-center bg-white p-12">
          <div className="w-full max-w-md">
            {/* Logo/Brand */}
            <div className="mb-6">
              <h1
                className="text-3xl font-bold text-hijautua mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                GajiBersih
              </h1>
              <p
                className="text-hijautua opacity-70"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Bersama GajiBersih, setiap keputusan karirmu lebih berarti. Buat
                akun dan jadilah bagian dari gerakan pekerja yang cerdas dan
                berdaya.{" "}
              </p>
            </div>

            {/* Segmented Control */}
            <div className="mb-6">
              <SegmentedControl
                options={tabs}
                selectedIndex={selectedTab}
                onSelectionChange={handleTabChange}
              />
            </div>

            {/* Form Content */}
            <div>
              {selectedTab === 0 ? (
                // Login Form --dekstop
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgba(33, 56, 19, 1)" }}
                    >
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <svg
                          className="h-5 w-5"
                          style={{ color: "rgba(33, 56, 19, 0.5)" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) =>
                          handleLoginChange("email", e.target.value)
                        }
                        placeholder="greevo@gmail.com"
                        className="w-full pl-10 pr-4 py-3 border focus:ring-2 focus:outline-none"
                        style={{
                          borderRadius: "10px",
                          border: "1px solid #213813",
                          color: "rgba(33, 56, 19, 1)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(33, 56, 19, 1)";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(33, 56, 19, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#213813";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "rgba(33, 56, 19, 1)" }}
                    >
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <svg
                          className="h-5 w-5"
                          style={{ color: "rgba(33, 56, 19, 0.5)" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2m0 0H9a2 2 0 00-2 2v2m0 0a2 2 0 102 2m-2-2a2 2 0 002 2m0 0V9a2 2 0 002-2m-2 2H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2"
                          />
                        </svg>
                      </div>
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) =>
                          handleLoginChange("password", e.target.value)
                        }
                        placeholder="••••••••••••••••"
                        className="w-full pl-10 pr-12 py-3 border focus:ring-2 focus:outline-none"
                        style={{
                          borderRadius: "10px",
                          border: "1px solid #213813",
                          color: "rgba(33, 56, 19, 1)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(33, 56, 19, 1)";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(33, 56, 19, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#213813";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg
                          className="h-5 w-5"
                          style={{ color: "rgba(33, 56, 19, 0.5)" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {showLoginPassword ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          ) : (
                            <>
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
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center mt-6">
                    <input
                      id="remember-me-desktop"
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) =>
                        handleLoginChange("rememberMe", e.target.checked)
                      }
                      className="h-4 w-4 rounded focus:ring-2 focus:outline-none"
                      style={{
                        accentColor: "rgba(33, 56, 19, 1)",
                        borderColor: "rgba(33, 56, 19, 1)",
                      }}
                    />
                    <label
                      htmlFor="remember-me-desktop"
                      className="ml-2 text-sm"
                      style={{
                        color: "rgba(33, 56, 19, 1)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Ingat saya
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white py-3 px-4 hover:opacity-90 transition-colors font-medium mt-8 bg-gradient-hijau"
                    style={{
                      borderRadius: "20px",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Masuk
                  </button>
                </form>
              ) : (
                // Register Form --Dekstop
                <form onSubmit={handleSubmit} className="space-y-3">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "rgba(33, 56, 19, 1)" }}
                    >
                      Foto Profil <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-16 h-16 rounded-full object-cover border-2"
                            style={{ borderColor: "rgba(33, 56, 19, 1)" }}
                          />
                        ) : (
                          <div
                            className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center"
                            style={{ borderColor: "rgba(33, 56, 19, 0.5)" }}
                          >
                            <svg
                              className="w-8 h-8"
                              style={{ color: "rgba(33, 56, 19, 0.5)" }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                          id="profile-photo-desktop"
                        />
                        <label
                          htmlFor="profile-photo-desktop"
                          className="cursor-pointer inline-flex items-center justify-center text-sm font-medium text-white gap-2 w-full bg-gradient-hijau"
                          style={{
                            height: "32px",
                            borderRadius: "30px",
                          }}
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
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          Pilih Foto
                        </label>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "rgba(33, 56, 19, 0.6)" }}
                        >
                          JPG/PNG/WEBP, maks 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "rgba(33, 56, 19, 1)" }}
                      >
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        placeholder="Contoh: Rina Maulida"
                        className="w-full px-4 py-2.5 border focus:ring-2 focus:outline-none"
                        style={{
                          borderRadius: "10px",
                          border: "1px solid #213813",
                          color: "rgba(33, 56, 19, 1)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(33, 56, 19, 1)";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(33, 56, 19, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#213813";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "rgba(33, 56, 19, 1)" }}
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Contoh: rina@gmail.com"
                        className="w-full px-4 py-2.5 border focus:ring-2 focus:outline-none"
                        style={{
                          borderRadius: "10px",
                          border: "1px solid #213813",
                          color: "rgba(33, 56, 19, 1)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(33, 56, 19, 1)";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(33, 56, 19, 0.2)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#213813";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "rgba(33, 56, 19, 1)" }}
                      >
                        Kata Sandi <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          placeholder="Minimal 6 karakter"
                          className="w-full px-4 pr-12 py-2.5 border focus:ring-2 focus:outline-none"
                          style={{
                            borderRadius: "10px",
                            border: "1px solid #213813",
                            color: "rgba(33, 56, 19, 1)",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "rgba(33, 56, 19, 1)";
                            e.target.style.boxShadow =
                              "0 0 0 2px rgba(33, 56, 19, 0.2)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#213813";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg
                            className="h-5 w-5"
                            style={{ color: "rgba(33, 56, 19, 0.5)" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {showPassword ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            ) : (
                              <>
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
                              </>
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "rgba(33, 56, 19, 1)" }}
                      >
                        Konfirmasi Kata Sandi{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          placeholder="Ulangi kata sandi"
                          className="w-full px-4 pr-12 py-2.5 border focus:ring-2 focus:outline-none"
                          style={{
                            borderRadius: "10px",
                            border: "1px solid #213813",
                            color: "rgba(33, 56, 19, 1)",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "rgba(33, 56, 19, 1)";
                            e.target.style.boxShadow =
                              "0 0 0 2px rgba(33, 56, 19, 0.2)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#213813";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg
                            className="h-5 w-5"
                            style={{ color: "rgba(33, 56, 19, 0.5)" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {showConfirmPassword ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            ) : (
                              <>
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
                              </>
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start mt-4">
                    <input
                      id="agree-terms-desktop"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="h-4 w-4 rounded focus:ring-2 focus:outline-none mt-1"
                      style={{
                        accentColor: "rgba(33, 56, 19, 1)",
                        borderColor: "rgba(33, 56, 19, 1)",
                      }}
                    />
                    <label
                      htmlFor="agree-terms-desktop"
                      className="ml-2 text-sm leading-relaxed"
                      style={{ color: "rgba(33, 56, 19, 1)" }}
                    >
                      Saya setuju dengan{" "}
                      <a
                        href="/terms"
                        className="underline hover:no-underline"
                        style={{ color: "rgba(33, 56, 19, 1)" }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        syarat & kebijakan privasi
                      </a>{" "}
                      GajiBersih.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="w-full text-white py-2.5 px-4 hover:opacity-90 transition-colors font-medium mt-4 bg-gradient-hijau disabled:opacity-60"
                    style={{
                      borderRadius: "20px",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {registerLoading ? "Memproses..." : "Daftar"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="w-1/2 bg-gradient-hijau flex flex-col justify-center items-center relative overflow-hidden z-11">
          <div className="absolute top-10 left-10 w-20 h-20 bg-hijauterang rounded-full   z-11"></div>

          <div className="absolute top-20 right-10 z-11 w-65 hover:scale-105 transition-transform duration-300">
            <img src="/auth/auth2.png" alt="" />
          </div>

          <div className="absolute bottom-1  left-9  z-12 w-79 hover:scale-102 transition-transform duration-300">
            {" "}
            <img src="/auth/auth1.png" alt="" />
          </div>

          <div className="absolute bottom-10 right-10 w-16 h-16 bg-hijauterang opacity-20 z-12"></div>

          <div className="relative ">
            <img
              src="/auth/auth.png"
              alt="foto orang sedang mencari kerja"
              className="w-full max-w-[610px] h-auto object-contain drop-shadow-2xl hover:scale-101 transition-transform duration-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
