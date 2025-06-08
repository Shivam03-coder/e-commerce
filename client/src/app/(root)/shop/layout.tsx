import React from "react";
import ShopsHeader from "./shops-header";
import Footer from "./footer";
import PaginationSection from "./pagination";

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
