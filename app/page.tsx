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
   <div className="bg-gradienthijau">
      <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
   </div>
  );
}
