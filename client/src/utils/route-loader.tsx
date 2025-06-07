// components/RouteLoader.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import Spinner from "@/components/global/spinner";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="center h-full w-full">
      <Spinner size={60}   />
    </div>
  );
}
