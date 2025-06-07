"use client";
import React from "react";
import { Home, Package, ShoppingCart, BarChart, Feather } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { Users, Gavel, Contact } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMounted } from "usehooks-ts";
import UserProfile from "@/components/global/user-profile";
import useAppLinks from "@/navigations";
import AppImages from "@/constants/images";
export default function AdminAppSidebar() {
  const links = useAppLinks();
  const Mount = useIsMounted();
  if (!links || Object.values(links).some((link) => !link)) return null;
  const { state } = useSidebar();

  const items = [
    {
      title: "Products",
      url: links?.products,
      icon: Package,
      tooltip: "Manage your product catalog",
    },
    {
      title: "Featured",
      url: links?.featured,
      icon: Feather,
      tooltip: "Manage your featured catalog",
    },

    {
      title: "Orders",
      url: links?.orders,
      icon: ShoppingCart,
      tooltip: "View and process customer orders",
    },
    {
      title: "Customers",
      url: links?.customers,
      icon: Users,
      tooltip: "Manage customer accounts",
    },
  ];

  if (!Mount) return null;
  return (
    <Sidebar collapsible="icon">
      <TooltipProvider delayDuration={300}>
        <SidebarHeader className="py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="font-inter" asChild>
                <Link href="/">
                  <div className="text-lg font-bold">
                    <Image
                      alt="app-logo"
                      src={AppImages.logo}
                      width={120}
                      height={50}
                    />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="text-sm">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link href={item.url}>
                            <item.icon />
                            <span className="text-black">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[300px]">
                        {item.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu className="rounded-xl bg-slate-50">
            <SidebarMenuItem>
              <UserProfile />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </TooltipProvider>
    </Sidebar>
  );
}
