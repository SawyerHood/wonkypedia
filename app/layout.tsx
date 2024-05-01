import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/ui/Header";
import { IS_LOCAL } from "@/shared/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wonkypedia",
  description: "Wikipedia for a different dimension",
};

export const runtime = "edge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
      <GoogleAnalytics gaId="G-0LGWDS3HJD" />
    </html>
  );
}
