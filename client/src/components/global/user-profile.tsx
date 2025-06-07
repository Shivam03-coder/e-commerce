"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ellipsis, User2 } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import { useAppToasts } from "@/hooks/use-app-toast";
import { useGetUserInfoQuery, useUserLogoutMutation } from "@/apis/auth-api";

const UserProfile = () => {
  const { data: user, isLoading, isError } = useGetUserInfoQuery();
  const [logout] = useUserLogoutMutation();
  const { ErrorToast, SuccessToast } = useAppToasts();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      SuccessToast({ title: "Logged out successfully" });
      router.push("/sign-in");
    } catch (error) {
      ErrorToast({ title: "Failed to logout" });
      console.error("Logout error:", error);
    }
  };

  if (isLoading) return <div className="p-2">Loading...</div>;
  if (isError) return <div className="p-2 text-red-500">Error loading user</div>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="flex items-center gap-2 w-full">
          <div className="flex items-center gap-2 w-full">
            <User2 className="h-5 w-5" />
            <span className="truncate max-w-[120px]">{user?.result?.name}</span>
            <Ellipsis className="h-4 w-4 ml-auto" />
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white w-48" align="end">
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;