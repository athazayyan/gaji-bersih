"use client";

import React from "react";
import Image from "next/image";

interface UserAvatarProps {
  userName?: string;
  size?: number;
}

export default function UserAvatar({
  userName = "User",
  size = 48,
}: UserAvatarProps) {
  // Generate initial from username
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div
      className="rounded-full bg-gradient-hijau flex items-center justify-center overflow-hidden"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
      }}
    >
      <span
        className="text-white font-bold"
        style={{
          fontSize: `${size / 2}px`,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {initial}
      </span>
    </div>
  );
}
