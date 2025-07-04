import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import NavigationBar from "@/components/NavigationBar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Docify - Secure Document Verification Platform",
  description: "Revolutionary blockchain-based document verification platform providing secure, instant, and transparent credential authentication for educational institutions and organizations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-blue-50`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <NavigationBar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
