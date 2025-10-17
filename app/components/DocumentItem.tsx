"use client";

import React from "react";

interface DocumentItemProps {
  title: string;
  onClick?: () => void;
}

export default function DocumentItem({ title, onClick }: DocumentItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
    >
      <div
        className="bg-white rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          width: "41px",
          height: "41px",
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <p
        className="text-white text-left font-semibold"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "12px",
        }}
      >
        {title}
      </p>
    </button>
  );
}
