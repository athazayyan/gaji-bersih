"use client";

interface SkeletonLoaderProps {
  type?: "page" | "card" | "list" | "auth";
  variant?: "page" | "card" | "list" | "auth"; // Alias for type
  message?: string;
}

export default function SkeletonLoader({
  type,
  variant,
  message = "Memuat...",
}: SkeletonLoaderProps) {
  // Support both 'type' and 'variant' props
  const skeletonType = variant || type || "page";

  if (skeletonType === "auth") {
    // Skeleton untuk proses authentication dengan shimmer
    return (
      <div className="fixed inset-0 z-50 bg-gradient-hijau flex items-center justify-center">
        <div className="text-center">
          {/* Logo Animation dengan shimmer */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 skeleton-shimmer"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/icon/icon-notext.svg"
                  alt="Loading"
                  className="w-12 h-12 animate-bounce"
                />
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <h3
            className="text-white text-xl font-semibold mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {message}
          </h3>

          {/* Loading Bar dengan shimmer */}
          <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-white rounded-full animate-loading-bar"></div>
          </div>

          {/* Sub Text */}
          <p
            className="text-white/80 text-sm mt-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Mohon tunggu sebentar...
          </p>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          @keyframes loading-bar {
            0% {
              width: 0%;
              margin-left: 0%;
            }
            50% {
              width: 50%;
              margin-left: 25%;
            }
            100% {
              width: 0%;
              margin-left: 100%;
            }
          }
          .skeleton-shimmer {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.3) 50%,
              rgba(255, 255, 255, 0.1) 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s ease-in-out infinite;
          }
          .animate-loading-bar {
            animation: loading-bar 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  if (skeletonType === "page") {
    // Skeleton untuk loading page penuh dengan shimmer effect
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Header Skeleton dengan shimmer */}
          <div className="bg-gradient-hijau h-48 relative overflow-hidden">
            <div className="skeleton-shimmer-overlay"></div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {/* Title skeleton */}
            <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden w-3/4">
              <div className="skeleton-shimmer-overlay"></div>
            </div>

            {/* Text skeletons */}
            <div className="relative h-4 bg-gray-200 rounded overflow-hidden w-full">
              <div className="skeleton-shimmer-overlay"></div>
            </div>
            <div className="relative h-4 bg-gray-200 rounded overflow-hidden w-5/6">
              <div className="skeleton-shimmer-overlay"></div>
            </div>

            {/* Card grid skeleton */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="relative h-24 bg-gray-200 rounded-xl overflow-hidden">
                <div className="skeleton-shimmer-overlay"></div>
              </div>
              <div className="relative h-24 bg-gray-200 rounded-xl overflow-hidden">
                <div className="skeleton-shimmer-overlay"></div>
              </div>
            </div>

            {/* List skeleton */}
            <div className="space-y-3 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative h-20 bg-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="skeleton-shimmer-overlay"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="max-w-[1400px] mx-auto p-8">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-8">
              <div className="relative h-10 bg-gray-200 rounded-lg overflow-hidden w-64">
                <div className="skeleton-shimmer-overlay"></div>
              </div>
              <div className="relative h-10 bg-gray-200 rounded-full overflow-hidden w-10">
                <div className="skeleton-shimmer-overlay"></div>
              </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-12 gap-6">
              {/* Sidebar Skeleton */}
              <div className="col-span-3 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="relative h-16 bg-gray-200 rounded-xl overflow-hidden"
                  >
                    <div className="skeleton-shimmer-overlay"></div>
                  </div>
                ))}
              </div>

              {/* Main Content Skeleton */}
              <div className="col-span-9 space-y-6">
                <div className="relative h-48 bg-gray-200 rounded-2xl overflow-hidden">
                  <div className="skeleton-shimmer-overlay"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="relative h-32 bg-gray-200 rounded-xl overflow-hidden"
                    >
                      <div className="skeleton-shimmer-overlay"></div>
                    </div>
                  ))}
                </div>
                <div className="relative h-96 bg-gray-200 rounded-2xl overflow-hidden">
                  <div className="skeleton-shimmer-overlay"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .skeleton-shimmer-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.6) 50%,
              transparent 100%
            );
            animation: shimmer 1.5s infinite;
          }
        `}</style>
      </div>
    );
  }

  if (skeletonType === "card") {
    // Skeleton untuk loading card dengan shimmer effect
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 shadow-sm space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center space-x-3">
              {/* Avatar skeleton */}
              <div className="relative w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                <div className="skeleton-shimmer-overlay"></div>
              </div>

              {/* Text skeletons */}
              <div className="flex-1 space-y-2">
                <div className="relative h-4 bg-gray-200 rounded overflow-hidden w-3/4">
                  <div className="skeleton-shimmer-overlay"></div>
                </div>
                <div className="relative h-3 bg-gray-200 rounded overflow-hidden w-1/2">
                  <div className="skeleton-shimmer-overlay"></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .skeleton-shimmer-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.8) 50%,
              transparent 100%
            );
            animation: shimmer 1.5s infinite;
          }
        `}</style>
      </div>
    );
  }

  if (skeletonType === "list") {
    // Skeleton untuk loading list dengan shimmer effect
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center space-x-3 p-3 bg-white rounded-lg relative overflow-hidden"
          >
            {/* Icon skeleton */}
            <div className="relative w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
              <div className="skeleton-shimmer-overlay"></div>
            </div>

            {/* Text skeletons */}
            <div className="flex-1 space-y-2">
              <div className="relative h-4 bg-gray-200 rounded overflow-hidden w-2/3">
                <div className="skeleton-shimmer-overlay"></div>
              </div>
              <div className="relative h-3 bg-gray-200 rounded overflow-hidden w-1/2">
                <div className="skeleton-shimmer-overlay"></div>
              </div>
            </div>
          </div>
        ))}

        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .skeleton-shimmer-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.8) 50%,
              transparent 100%
            );
            animation: shimmer 1.5s infinite;
          }
        `}</style>
      </div>
    );
  }

  return null;
}
