import React from "react";
import { ShoppingCart, User, ShoppingBag } from "lucide-react";
import Image from "next/image";
import AppImages from "@/constants/images";
import sockCategories from "@/constants/socks-category";
import HeaderSettings from "@/components/global/header-settings";

const ShopsHeader = () => {
  return (
    <header className="bg-background sticky top-0 z-40 w-full">
      <nav className="flex items-center justify-between px-8 py-4">
        {/* APP LOGO */}
        <div className="text-lg font-bold">
          <Image alt="app-logo" src={AppImages.logo} width={120} height={50} />
        </div>

        {/* ICONS */}
        <div className="flex items-center space-x-6">
          <button className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="bg-primary absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
              0
            </span>
          </button>

          <button>
            <HeaderSettings />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default ShopsHeader;
