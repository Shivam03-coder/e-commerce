import BackButton from "@/components/global/back-button";
import React, { type ReactNode } from "react";
import NavigationBox from "./navigation-box";

const ProfileRootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="root p-4">
      <BackButton />
      <NavigationBox />
    </main>
  );
};

export default ProfileRootLayout;
