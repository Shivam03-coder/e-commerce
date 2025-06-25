"use client";
import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import AppImages from "@/constants/images";
import HeaderSettings from "@/components/global/header-settings";
import { useTransitionRouter } from "next-view-transitions";
import useAppLinks from "@/navigations";
import { useAppSelector } from "@/store";

const ShopsHeader = () => {
  const router = useTransitionRouter();
  const navs = useAppLinks();
  const [temsInCart, setItemsInCart] = useState<number>(0);

  return (
    <header className="sticky top-0 z-40 w-full bg-green-50">
      <nav className="flex items-center justify-between px-8 py-4">
        {/* APP LOGO */}
        <div className="text-lg font-bold">
          <Image alt="app-logo" src={AppImages.logo} width={120} height={50} />
        </div>

        {/* ICONS */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => router.push(navs.cart)}
            className="relative cursor-pointer"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="bg-primary absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
              {temsInCart || 0}
            </span>
          </button>

          <button>
            <HeaderSettings setItemsInCart={setItemsInCart} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default ShopsHeader;
