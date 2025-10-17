"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect will be handled by middleware
    // This is just a fallback loading state
    router.push("/auth");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hijau">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg font-medium">Memuat GajiBersih...</p>
      </div>
    </div>
  );
}
