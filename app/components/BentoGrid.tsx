"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface BentoCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  value?: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  gradient?: string;
  onClick?: () => void;
}

export function BentoCard({
  title,
  description,
  icon,
  value,
  trend,
  className = "",
  gradient = "from-hijauterang to-hijaubiru",
  onClick,
}: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-6 bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all cursor-pointer ${className}`}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
          >
            {icon || (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            )}
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                trend.isPositive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <svg
                className={`w-3 h-3 ${trend.isPositive ? "" : "rotate-180"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {trend.value}%
            </div>
          )}
        </div>

        <h3
          className="text-gray-600 text-sm font-medium mb-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {title}
        </h3>

        {value && (
          <p
            className="text-4xl font-bold text-hijautua mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {value}
          </p>
        )}

        {description && (
          <p
            className="text-gray-500 text-xs"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-hijauterang/10 to-transparent rounded-full blur-2xl" />
    </motion.div>
  );
}

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      {children}
    </div>
  );
}
