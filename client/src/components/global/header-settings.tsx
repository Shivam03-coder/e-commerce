"use client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserInfoQuery, useUserLogoutMutation } from "@/apis/auth-api";
import { useAppToasts } from "@/hooks/use-app-toast";
import { useTransitionRouter } from "next-view-transitions";

const HeaderSettings = () => {
  const { data, isLoading } = useGetUserInfoQuery();
  if (!data || isLoading) return null;
  const name = data?.result?.name.slice(0, 2).toUpperCase();
  if (!name) return;
  return <UserProfile name={name as string} />;
};

export default HeaderSettings;

const UserProfile = ({ name }: { name: string }) => {
  const { ErrorToast, SuccessToast } = useAppToasts();
  const router = useTransitionRouter();
  const [logout] = useUserLogoutMutation();
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
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
