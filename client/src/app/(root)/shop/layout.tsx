import React from "react";
import ShopsHeader from "./_shop-header/shops-header";

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
