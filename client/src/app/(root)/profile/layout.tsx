import BackButton from "@/components/global/back-button";
import React, { type ReactNode } from "react";
import NavigationBox from "./navigation-box";

const ProfileRootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="root p-4">
      <BackButton />
      <div className="grid grid-cols-5">
        <NavigationBox  />
        {children}
      </div>
    </main>
  );
};

export default ProfileRootLayout;
