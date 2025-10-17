import Image from "next/image";

export type AlertLevel = "warning" | "danger" | "safe";

interface AlertCardProps {
  level: AlertLevel;
  message: string;
}

const alertConfig = {
  warning: {
    bgColor: "#FFF4E5",
    iconSrc: "/icon/warning.svg",
    iconBg: "#FFB800",
  },
  danger: {
    bgColor: "#FFE5E5",
    iconSrc: "/icon/danger.svg",
    iconBg: "#FF4444",
  },
  safe: {
    bgColor: "#E5F4E5",
    iconSrc: "/icon/safe.svg",
    iconBg: "#4CAF50",
  },
};

export default function AlertCard({ level, message }: AlertCardProps) {
  const config = alertConfig[level];

  return (
    <div
      className="flex items-center gap-4 p-5 rounded-2xl relative overflow-hidden"
      style={{
        backgroundColor: config.bgColor,
        border: `2px solid ${config.iconBg}20`,
      }}
    >
      {/* Decorative background element */}
      <div
        className="absolute -right-8 -top-8 rounded-full opacity-10"
        style={{
          width: "120px",
          height: "120px",
          backgroundColor: config.iconBg,
        }}
      />

      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full relative z-10"
        style={{
          width: "52px",
          height: "52px",
          backgroundColor: config.iconBg,
          boxShadow: `0px 4px 12px ${config.iconBg}40`,
        }}
      >
        <div className="text-white text-2xl font-bold">
          {level === "warning" && "⚠"}
          {level === "danger" && "!"}
          {level === "safe" && "✓"}
        </div>
      </div>
      <p
        className="flex-1 font-semibold relative z-10"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "14px",
          lineHeight: "1.5",
          color: "#213813",
        }}
      >
        {message}
      </p>
    </div>
  );
}
