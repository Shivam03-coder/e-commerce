import React from "react";
import { ShoppingCart, User, ShoppingBag } from "lucide-react";
import Image from "next/image";
import AppImages from "@/constants/images";
import sockCategories from "@/constants/socks-category";

const ShopsHeader = () => {
  return (
    <header className="bg-background sticky top-0 z-40 w-full">
      <nav className="flex items-center justify-between px-6 py-4">
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
            <User className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* MOBILE CATEGORIES */}
      <div className="overflow-x-auto bg-gray-50 px-4 py-3 md:hidden">
        <div className="flex min-w-max space-x-6">
          {sockCategories.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              <a
                href="#"
                className="relative flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm"
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
                <button className="text-primary ml-1">
                  <ShoppingBag className="h-3 w-3" />
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default ShopsHeader;
