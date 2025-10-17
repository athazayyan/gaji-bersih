"use client";

import React from "react";

interface GradientCardProps {
  title: string;
  buttonText: string;
  onClick?: () => void;
  width?: string;
  height?: string;
  titleSize?: string;
  isSmallCard?: boolean;
}

export default function GradientCard({
  title,
  buttonText,
  onClick,
  width = "365px",
  height = "152px",
  titleSize = "32px",
  isSmallCard = false,
}: GradientCardProps) {
  return (
    <div
      className="bg-gradient-hijau flex flex-col justify-between relative"
      style={{
        width: width,
        height: height,
        borderRadius: "15px",
        flexShrink: 0,
        padding: isSmallCard ? "12px" : "16px",
      }}
    >
      <h2
        className="text-white font-semibold italic"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: titleSize,
          fontWeight: 600,
          lineHeight: "normal",
        }}
      >
        {title}
      </h2>

      <div className="flex justify-end">
        <button
          onClick={onClick}
          className="bg-white flex items-center gap-2 transition-transform hover:scale-105 relative overflow-hidden"
          style={{
            minWidth: isSmallCard ? "110px" : "180px",
            height: isSmallCard ? "32px" : "36px",
            borderRadius: "20px",
            flexShrink: 0,
            padding: isSmallCard ? "0 6px 0 3px" : "0 8px 0 4px",
          }}
        >
          <div
            className="bg-gradient-hijau rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              width: isSmallCard ? "24px" : "28px",
              height: isSmallCard ? "24px" : "28px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={isSmallCard ? "10" : "12"}
              height={isSmallCard ? "10" : "12"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <span
            className="text-hijautua font-medium flex-1 text-center whitespace-nowrap"
            style={{
              fontSize: isSmallCard ? "10px" : "11px",
              fontFamily: "Poppins, sans-serif",
              paddingRight: isSmallCard ? "4px" : "8px",
            }}
          >
            {buttonText}
          </span>
        </button>
      </div>
    </div>
  );
}
