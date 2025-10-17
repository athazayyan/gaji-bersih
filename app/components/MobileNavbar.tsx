"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface MobileNavbarProps {
  className?: string;
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    path: "/home",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="20px"
        fill="currentColor"
      >
        <path d="M180-120q-25 0-42.5-17.5T120-180v-76l160-142v278H180Zm140 0v-160h320v160H320Zm360 0v-328L509-600l121-107 190 169q10 9 15 20.5t5 24.5v313q0 25-17.5 42.5T780-120H680ZM120-310v-183q0-13 5-25t15-20l300-266q8-8 18.5-11.5T480-819q11 0 21.5 3.5T520-804l80 71-480 423Z" />
      </svg>
    ),
  },
  {
    id: "history",
    label: "History",
    path: "/history",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="20px"
        fill="currentColor"
      >
        <path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="20px"
        fill="currentColor"
      >
        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
      </svg>
    ),
  },
];

export default function MobileNavbar({ className }: MobileNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Hide navbar on upload pages
  const shouldHideNavbar =
    pathname.includes("/uploadBerkas") || pathname.includes("/upload");

  const handleNavClick = (path: string) => {
    router.push(path);
  };

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:hidden ${
        className || ""
      }`}
    >
      <nav
        className="mx-auto max-w-sm bg-white/95 backdrop-blur-xl rounded-full shadow-2xl border border-gray-200/30"
        style={{
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="flex items-center justify-around px-3 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`
                  relative flex flex-col items-center justify-center 
                  transition-all duration-500 ease-out group
                  min-w-[64px] h-[64px] rounded-full overflow-hidden
                  ${
                    isActive
                      ? "text-white transform scale-110 shadow-xl"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 hover:scale-105"
                  }
                `}
                style={{
                  transformOrigin: "center center",
                }}
              >
                {/* Background gradient when active */}
                {isActive && (
                  <div
                    className="absolute inset-0 bg-gradient-hijau rounded-full"
                    style={{
                      background: "var(--gradient-hijau)",
                    }}
                  />
                )}

                {/* Icon container */}
                <div
                  className={`
                    relative z-10 flex flex-col items-center 
                    transition-all duration-300
                    ${isActive ? "transform scale-105" : "transform scale-100"}
                  `}
                >
                  <div className="mb-1">{item.icon}</div>

                  <span
                    className={`
                      text-[10px] font-medium leading-none 
                      transition-all duration-300
                      ${
                        isActive
                          ? "text-white opacity-100"
                          : "text-gray-400 opacity-80"
                      }
                    `}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Hover effect */}
                <div
                  className={`
                    absolute inset-0 bg-gray-100 rounded-full 
                    transition-all duration-300 ease-out
                    ${
                      !isActive
                        ? "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                        : "opacity-0"
                    }
                  `}
                />

                {/* Active glow effect with green gradient */}
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-full blur-xl opacity-25 scale-125 animate-pulse"
                    style={{
                      background: "var(--gradient-hijau)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
