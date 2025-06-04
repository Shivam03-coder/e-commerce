import React, { type ReactNode } from "react";

const AuthRootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-muted center min-h-screen w-full">
      <main className="bg-card lg:border-primary lg:border mx-auto w-full px-4 lg:max-w-[40%] lg:rounded-3xl lg:px-5">
        {children}
      </main>
    </div>
  );
};

export default AuthRootLayout;