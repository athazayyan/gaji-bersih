"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HorizontalNavbar from "@/app/components/HorizontalNavbar";
import { createClient } from "@/lib/supabase/client";
import { da } from "zod/locales";
interface UserProfile {
  full_name: string | null;
  avatar_path: string | null;
  email: string | null;
} 

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [data, setData] = useState<UserProfile | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    "/dummy/dummyProfil.png"
  );

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFormData({
          full_name: profile.full_name || "",
          email: profile.email || user.email || "",
         
        });

        if (profile.avatar_path) {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(profile.avatar_path);
          setAvatarPreview(data.publicUrl);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (userId: string) => {
    if (!avatarFile) return null;

    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) throw uploadError;

    return filePath;
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Upload avatar if changed
      let avatarPath = null;
      if (avatarFile) {
        avatarPath = await uploadAvatar(user.id);
      }

      // Update profile
      const updateData: any = {
        full_name: formData.full_name,
        email: formData.email,

        updated_at: new Date().toISOString(),
      };

      if (avatarPath) {
        updateData.avatar_path = avatarPath;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update email if changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        });
        if (emailError) throw emailError;
      }

      setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
      setIsEditing(false);
      setAvatarFile(null);

      // Reload profile
      setTimeout(() => loadProfile(), 1000);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setMessage({
        type: "error",
        text: error.message || "Gagal menyimpan profil",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Password baru tidak cocok!" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password minimal 6 karakter!" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Password berhasil diubah!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      setMessage({
        type: "error",
        text: error.message || "Gagal mengubah password",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <HorizontalNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hijauterang mx-auto mb-4"></div>
            <p
              className="text-hijautua"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Memuat profil...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HorizontalNavbar />

      {/* Mobile Layout */}
      <div className="min-h-screen pb-24 bg-white lg:hidden">
        {/* Mobile Header */}
        <div
          className="bg-gradient-hijau relative"
          style={{
            width: "100%",
            maxWidth: "414px",
            height: "180px",
            borderRadius: "0 0 30px 30px",
            margin: "0 auto",
          }}
        >
          <div className="px-6 pt-12 pb-6">
            <button
              onClick={() => router.push("/settings")}
              className="mb-4 text-white flex items-center gap-2"
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
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Kembali
            </button>
            <h1
              className="text-white font-bold"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "28px",
              }}
            >
              Profil Saya
            </h1>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="px-6 pt-5">
          <div className="max-w-md mx-auto">
            {/* Profile Photo */}
            <div className="text-center mb-6">
              <div
                className="rounded-full overflow-hidden bg-gradient-hijau mx-auto mb-4 relative"
                style={{ width: "100px", height: "100px" }}
              >
                <Image
                  src={data?.avatar_path || avatarPreview}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
              {isEditing && (
                <>
                  <input
                    type="file"
                    id="avatar-mobile"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar-mobile"
                    className="text-hijauterang font-semibold text-sm cursor-pointer hover:underline"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Ubah Foto
                  </label>
                </>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label
                  className="block text-hijautua font-medium mb-2 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-hijauterang disabled:bg-gray-50"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </div>

              <div>
                <label
                  className="block text-hijautua font-medium mb-2 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-hijauterang disabled:bg-gray-50"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </div>
            </div>

            {/* Password Change Section */}
            {!isEditing && (
              <div className="mb-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                <h3
                  className="text-hijautua font-semibold text-lg mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Ubah Password
                </h3>

                <div className="space-y-3">
                  <div>
                    <label
                      className="block text-hijautua font-medium mb-2 text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Password Saat Ini
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-hijauterang"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {showCurrentPassword ? (
                            <>
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </>
                          ) : (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-hijautua font-medium mb-2 text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-hijauterang"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {showNewPassword ? (
                            <>
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </>
                          ) : (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-hijautua font-medium mb-2 text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-hijauterang"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {showConfirmPassword ? (
                            <>
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </>
                          ) : (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={
                      saving ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                    className="w-full bg-gradient-hijau text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {saving ? "Mengubah..." : "Ubah Password"}
                  </button>
                </div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div
                className={`mb-4 p-4 rounded-xl ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border-2 border-green-200"
                    : "bg-red-50 text-red-700 border-2 border-red-200"
                }`}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {message.text}
              </div>
            )}

            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setAvatarFile(null);
                    loadProfile();
                  }}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-gradient-hijau text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-hijau text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Edit Profil
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 pt-24 pb-12">
        <div className="max-w-[1000px] mx-auto px-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/settings")}
            className="mb-6 text-hijautua flex items-center gap-2 hover:text-hijauterang transition-colors"
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
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Kembali ke Pengaturan
          </button>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-10">
            <h1
              className="text-hijautua font-bold text-4xl mb-8"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Profil Saya
            </h1>

            <div className="grid grid-cols-3 gap-8">
              {/* Left - Photo */}
              <div className="text-center">
                <div
                  className="rounded-full overflow-hidden bg-gradient-hijau mx-auto mb-4 relative"
                  style={{ width: "180px", height: "180px" }}
                >
                  <Image
                    src={avatarPreview}
                    alt="Profile"
                    width={180}
                    height={180}
                    className="object-cover"
                  />
                </div>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      id="avatar-desktop"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar-desktop"
                      className="text-hijauterang font-semibold hover:underline cursor-pointer"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Ubah Foto Profil
                    </label>
                  </>
                )}
              </div>

              {/* Right - Form */}
              <div className="col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-hijautua font-medium mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-hijauterang disabled:bg-gray-50"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-hijautua font-medium mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-hijauterang disabled:bg-gray-50"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                  </div>
                </div>

                {/* Password Change Section - Desktop */}
                {!isEditing && (
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                    <h3
                      className="text-hijautua font-semibold text-lg mb-4"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Ubah Password
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="col-span-2">
                        <label
                          className="block text-hijautua font-medium mb-2 text-sm"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Password Saat Ini
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-hijauterang"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#9CA3AF"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              {showCurrentPassword ? (
                                <>
                                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                  <line x1="1" y1="1" x2="23" y2="23" />
                                </>
                              ) : (
                                <>
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </>
                              )}
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-hijautua font-medium mb-2 text-sm"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Password Baru
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-hijauterang"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#9CA3AF"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              {showNewPassword ? (
                                <>
                                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                  <line x1="1" y1="1" x2="23" y2="23" />
                                </>
                              ) : (
                                <>
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </>
                              )}
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-hijautua font-medium mb-2 text-sm"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Konfirmasi Password Baru
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-hijauterang"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#9CA3AF"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              {showConfirmPassword ? (
                                <>
                                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                  <line x1="1" y1="1" x2="23" y2="23" />
                                </>
                              ) : (
                                <>
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </>
                              )}
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleChangePassword}
                      disabled={
                        saving ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword
                      }
                      className="w-full bg-gradient-hijau text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {saving ? "Mengubah..." : "Ubah Password"}
                    </button>
                  </div>
                )}

                {/* Message - Desktop */}
                {message && (
                  <div
                    className={`p-4 rounded-xl ${
                      message.type === "success"
                        ? "bg-green-50 text-green-700 border-2 border-green-200"
                        : "bg-red-50 text-red-700 border-2 border-red-200"
                    }`}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {message.text}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setAvatarFile(null);
                          loadProfile();
                        }}
                        className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-gradient-hijau text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {saving ? "Menyimpan..." : "Simpan Perubahan"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-gradient-hijau text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Edit Profil
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
