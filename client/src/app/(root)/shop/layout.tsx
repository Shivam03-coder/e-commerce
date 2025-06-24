import React from "react";
import ShopsHeader from "./shops-header";

export default function ShopsRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="root">
      <ShopsHeader />
      {children}
    </main>
  );
}
