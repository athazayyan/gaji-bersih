"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface SidebarProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
    label: "Upload Regulasi",
    href: "/admin/upload-regulasi",
  },
  {
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    label: "Kelola Regulasi",
    href: "/admin/manage-regulasi",
  },
];

export default function AdminSidebar({ children }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      // Clear any session/token if needed
      router.push("/");
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-hijauterang via-hijaudaun to-hijautua z-50 px-4 py-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/icon/icon-text-color.svg"
              alt="GajiBersih Admin"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 top-[57px]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="lg:hidden fixed left-0 top-[65px] bottom-0 w-72 bg-gradient-to-b from-hijautua to-hijaubiru z-50 shadow-2xl overflow-y-auto"
            >
              <nav className="p-4 space-y-2">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-hijauterang to-hijaudaun text-white shadow-lg shadow-hijauterang/50"
                            : "text-hijaumuda hover:bg-hijauterang/20 hover:text-white"
                        }`}
                      >
                        <svg
                          className="w-6 h-6 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={item.icon}
                          />
                        </svg>
                        <span
                          className="font-medium"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {item.label}
                        </span>
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Logout Button Mobile */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-4 rounded-xl text-red-400 hover:bg-red-500/20 transition-all w-full mt-4"
                >
                  <svg
                    className="w-6 h-6 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span
                    className="font-medium"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Logout
                  </span>
                </motion.button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex min-h-screen bg-white">
        <motion.aside
          initial={false}
          animate={{
            width: isCollapsed ? "80px" : "280px",
          }}
          className="fixed left-0 top-0 h-screen bg-gradient-hijau shadow-2xl z-50 overflow-hidden"
        >
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <Image
                    src="/icon/icon-text-color.svg"
                    alt="GajiBersih"
                    width={140}
                    height={36}
                    className="h-9 w-auto"
                  />
                </motion.div>
              )}
              {isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mx-auto"
                >
                  <Image
                    src="/icon/icon-color.svg"
                    alt="GB"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                </motion.div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <svg
                  className={`w-5 h-5 text-white transition-transform ${
                    isCollapsed ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={index} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-hijauterang to-hijaudaun text-white shadow-lg shadow-hijauterang/50"
                          : "text-white hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-hijauterang to-hijaudaun"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <svg
                        className="w-6 h-6 flex-shrink-0 relative z-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                      {!isCollapsed && (
                        <span
                          className="font-medium relative z-10"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {item.label}
                        </span>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* User Section with Logout */}
            <div className="p-4 border-t border-white/20 space-y-2">
              <div
                className={`flex items-center gap-3 p-3 rounded-xl bg-white/20 backdrop-blur-sm ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-hijauterang to-hijaudaun flex items-center justify-center text-white font-bold shadow-lg">
                  A
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-white text-sm truncate"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Admin
                    </p>
                    <p
                      className="text-xs text-white/70 truncate"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      admin@gajibersih.id
                    </p>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className={`flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/20 transition-all w-full ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {!isCollapsed && (
                  <span
                    className="font-medium"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Logout
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          initial={false}
          animate={{
            marginLeft: isCollapsed ? "80px" : "280px",
          }}
          className="flex-1 transition-all duration-300"
        >
          {children}
        </motion.main>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden pt-[57px] pb-20 bg-white min-h-screen">
        {children}
      </div>
    </>
  );
}
