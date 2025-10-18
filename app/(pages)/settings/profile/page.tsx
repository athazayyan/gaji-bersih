"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HorizontalNavbar from "@/app/components/HorizontalNavbar";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Username",
    email: "user@email.com",
    phone: "+62 812-3456-7890",
    bio: "Pengguna Gaji Bersih yang aktif",
    address: "Jakarta, Indonesia",
    birthDate: "1990-01-01",
  });

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save to backend
    console.log("Saving profile:", formData);
  };

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
                className="rounded-full overflow-hidden bg-gradient-hijau mx-auto mb-4"
                style={{ width: "100px", height: "100px" }}
              >
                <Image
                  src="/dummy/dummyProfil.png"
                  alt="Profile"
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
              <button
                className="text-hijauterang font-semibold text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Ubah Foto
              </button>
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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

              <div>
                <label
                  className="block text-hijautua font-medium mb-2 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
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
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={3}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-hijauterang disabled:bg-gray-50 resize-none"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-hijau text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Simpan
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
                  className="rounded-full overflow-hidden bg-gradient-hijau mx-auto mb-4"
                  style={{ width: "180px", height: "180px" }}
                >
                  <Image
                    src="/dummy/dummyProfil.png"
                    alt="Profile"
                    width={180}
                    height={180}
                    className="object-cover"
                  />
                </div>
                <button
                  className="text-hijauterang font-semibold hover:underline"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Ubah Foto Profil
                </button>
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
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-hijautua font-medium mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
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
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) =>
                        setFormData({ ...formData, birthDate: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-hijauterang disabled:bg-gray-50"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-hijautua font-medium mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Alamat
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
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
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={4}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-hijauterang disabled:bg-gray-50 resize-none"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-gradient-hijau text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Simpan Perubahan
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
