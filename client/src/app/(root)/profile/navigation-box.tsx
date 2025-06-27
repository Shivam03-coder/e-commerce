"use client";
import React, { useState } from "react";
import { User, ShoppingBag, Home, ChevronRight } from "lucide-react";
import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const NavigationBox = () => {
  const [activeId, setActiveId] = useState<number>(1); // Default to first item

  const navigationList = [
    {
      id: 1,
      title: "Profile",
      href: "/profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      id: 2,
      title: "Orders",
      href: "/profile/orders",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      id: 3,
      title: "Address",
      href: "/profile/address",
      icon: <Home className="h-4 w-4" />,
    },
  ];

  return (
    <nav className="w-full col-span-1 max-w-full lg:max-w-[250px] rounded-none border border-green-200 bg-white shadow-sm">
      <div className="p-4">
        <h3 className="text-lg font-medium">Account Settings</h3>
      </div>

      <Separator className="bg-gray-200" />

      <div className="space-y-1">
        {navigationList.map((item) => (
          <React.Fragment key={item.id}>
            <Link href={item.href} onClick={() => setActiveId(item.id)}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 rounded-none px-3",
                  activeId === item.id
                    ? "bg-green-100 text-gray-900 hover:bg-gray-100"
                    : "hover:bg-gray-50",
                )}
              >
                <span className="text-gray-500">{item.icon}</span>
                <span>{item.title}</span>
                <ChevronRight
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform",
                    activeId === item.id ? "text-gray-700" : "text-gray-400",
                  )}
                />
              </Button>
            </Link>
            {item.id !== navigationList.length && (
              <Separator className="bg-gray-100" />
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default NavigationBox;
