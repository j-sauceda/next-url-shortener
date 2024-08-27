import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "./globals.css";
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "A simple URL shortener built with NextJS & MongoDB",
};

import AuthProvider from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
