import React, { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Notification({
  message,
  type,
  onClose,
  duration = 3000,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bgColor: "#E5F4E5",
      borderColor: "#4CAF50",
      iconColor: "#4CAF50",
      icon: "✓",
    },
    error: {
      bgColor: "#FFE5E5",
      borderColor: "#FF4444",
      iconColor: "#FF4444",
      icon: "✕",
    },
    info: {
      bgColor: "#FFF4E5",
      borderColor: "#FFB800",
      iconColor: "#FFB800",
      icon: "ℹ",
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
      style={{
        maxWidth: "90vw",
        width: "320px",
      }}
    >
      <div
        className="flex items-center gap-3 p-4 rounded-2xl shadow-lg"
        style={{
          backgroundColor: config.bgColor,
          border: `2px solid ${config.borderColor}`,
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full"
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: config.iconColor,
          }}
        >
          <span className="text-white font-bold text-sm">{config.icon}</span>
        </div>
        <p
          className="flex-1 font-medium"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "14px",
            color: "#213813",
          }}
        >
          {message}
        </p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-hijautua hover:opacity-70 transition-opacity"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
