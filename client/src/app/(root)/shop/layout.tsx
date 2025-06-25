import React from "react";
import ShopsHeader from "./shops-header";
import Footer from "./footer";

export default function ShopsRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="root relative bg-green-50">
      <ShopsHeader />
      {children}
      <Footer />
    </main>
  );
}
