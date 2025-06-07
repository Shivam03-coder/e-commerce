"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeft } from "lucide-react";
import { Link } from "next-view-transitions";
import HeaderSettings from "@/components/global/header-settings";

export default function AdminAppNavbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="textDark dark:bg-primary top-0 left-0 flex items-center justify-between bg-white px-3 py-2 print:hidden">
      <div className="ml-4 flex items-center">
        <Button className="shadow-none" size={"icon"} onClick={toggleSidebar}>
          <PanelLeft size={9} />
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Link href={"/dashboard"} />
        <HeaderSettings />
      </div>
    </nav>
  );
}
