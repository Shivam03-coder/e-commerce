"use client";
import AppImages from "@/constants/images";
import { Home, ShoppingBag, Heart, Info, Mail, Menu, X } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import React, { useState } from "react";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    {
      href: "/shop",
      label: "Products",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    { href: "/about", label: "About", icon: <Info className="h-5 w-5" /> },
    { href: "/contact", label: "Contact", icon: <Mail className="h-5 w-5" /> },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex flex-shrink-0 items-center">
              <Image
                alt="app-logo"
                src={AppImages.logo}
                width={120}
                height={50}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-primary flex items-center px-3 py-2 text-sm font-medium text-gray-600 transition-colors"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            <button className="bg-primary hover:bg-primary-dark flex items-center gap-x-2 rounded-full px-6 py-2 font-medium text-white transition-colors">
              <ShoppingBag className="h-6 w-6" /> Shop Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:text-primary text-gray-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-primary flex items-center px-3 py-2 text-gray-600"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <button className="bg-primary mt-4 flex w-full items-center justify-center rounded-md px-3 py-2 font-medium text-white">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
