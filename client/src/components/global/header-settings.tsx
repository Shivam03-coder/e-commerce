"use client";

import { useEffect } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserInfoQuery, useUserLogoutMutation } from "@/apis/auth-api";
import { useAppToasts } from "@/hooks/use-app-toast";
import { Link, useTransitionRouter } from "next-view-transitions";

interface HeaderSettingsProps {
  setItemsInCart?: (count: number) => void;
}

const HeaderSettings = ({ setItemsInCart }: HeaderSettingsProps) => {
  const { data, isLoading } = useGetUserInfoQuery();

  useEffect(() => {
    if (data?.result?.cart != null && setItemsInCart) {
      setItemsInCart(data.result.cart);
    }
  }, [data?.result?.cart, setItemsInCart]);

  const name = data?.result?.name?.slice(0, 2).toUpperCase();

  if (isLoading) return null;

  return <UserProfile name={name || "US"} />;
};

export default HeaderSettings;

const UserProfile = ({ name }: { name: string }) => {
  const { ErrorToast, SuccessToast } = useAppToasts();
  const router = useTransitionRouter();
  const [logout] = useUserLogoutMutation();

  const handleLogout = async () => {
    try {
      const res = await logout().unwrap();
      SuccessToast({ title: "Logged out successfully" });
      router.push("/sign-in");
    } catch (error) {
      ErrorToast({ title: "Failed to logout" });
      console.error("Logout error:", error);
    }
  };

  const handleGotoUserProfilePage = () => {
    router.push("/profile");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary border border-blue-500 text-white">
              {name}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="textDark font-lexend dark:bg-primary mr-9 bg-white">
        <DropdownMenuItem onClick={handleGotoUserProfilePage}>
          <User className="mr-2 h-4 w-4" />
          <span>User Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
