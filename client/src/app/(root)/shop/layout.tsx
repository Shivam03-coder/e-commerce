import React from "react";
import ShopsHeader from "./shops-header";
import Footer from "./footer";

export default function ShopsRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="root">
      <ShopsHeader />
      {children}
      <Footer />
    </main>
  );
}
