import React, { type ReactNode } from "react";
import NavigationBar from "./navigation-bar";

const HomeRootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      {children}
    </div>
  );
};

export default HomeRootLayout;
