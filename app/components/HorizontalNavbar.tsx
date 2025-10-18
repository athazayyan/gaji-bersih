"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    path: "/home",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="22px"
        viewBox="0 -960 960 960"
        width="22px"
        fill="currentColor"
      >
        <path d="M180-120q-25 0-42.5-17.5T120-180v-76l160-142v278H180Zm140 0v-160h320v160H320Zm360 0v-328L509-600l121-107 190 169q10 9 15 20.5t5 24.5v313q0 25-17.5 42.5T780-120H680ZM120-310v-183q0-13 5-25t15-20l300-266q8-8 18.5-11.5T480-819q11 0 21.5 3.5T520-804l80 71-480 423Z" />
      </svg>
    ),
  },
  {
    name: "History",
    path: "/history",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="22px"
        viewBox="0 -960 960 960"
        width="22px"
        fill="currentColor"
      >
        <path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
      </svg>
    ),
  },
  {
    name: "Settings",
    path: "/settings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="22px"
        viewBox="0 -960 960 960"
        width="22px"
        fill="currentColor"
      >
        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
      </svg>
    ),
  },
];

export default function HorizontalNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <motion.nav
      className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Image
              src="/icon/icon-text-color.svg"
              alt="GajiBersih"
              width={150}
              height={40}
              className="object-contain"
            />
          </div>

          {/* Center Navigation */}
          <div className="flex items-center space-x-2 bg-gray-50 rounded-2xl p-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.path || pathname.startsWith(item.path + "/");

              return (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-hijau text-white shadow-md"
                      : "text-hijautua hover:bg-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon}
                  <span
                    className="font-medium text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {item.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* User Profile */}
          <motion.div
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div
              className="rounded-full overflow-hidden bg-gradient-hijau flex-shrink-0"
              style={{
                width: "40px",
                height: "40px",
              }}
            >
              <Image
                src="/dummy/dummyProfil.png"
                alt="Profile"
                width={40}
                height={40}
                className="object-cover"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
            <div>
              <p
                className="font-semibold text-hijautua text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Username
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
