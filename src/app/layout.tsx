'use client';
/** @format */

import Header from "@/components/Header";
import SideNavbar from "@/components/SideNavbar";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current route
  const pathname = usePathname();

  // Define routes where Header and Sidebar should NOT be displayed
  const noLayoutRoutes = ["/", "/pages/signin", "/pages/signup", "/pages/signout"];

  // Determine if Header and Sidebar should be hidden
  const shouldHideHeaderAndSidebar = noLayoutRoutes.includes(pathname);

  return (
    <html lang="en" className={inter.className}>
      <SessionProvider>
        <body className="min-h-screen">
          <div className="flex flex-col h-screen">
            {!shouldHideHeaderAndSidebar && (
                <div className="w-full">
              <Header/>
                </div>
            )}
            
            <div className="flex flex-1 h-[calc(100vh-64px)]"> {/* Adjust 64px based on your header height */}
              {!shouldHideHeaderAndSidebar && (
                <div className="h-full">
                <SideNavbar/>
                </div>
              )}
              <main className={`flex-1 ${shouldHideHeaderAndSidebar ? "w-full" : "p-8"}`}>
                {children}
              </main>
            </div>
          </div>
        </body>
      </SessionProvider>
    </html>
  );
}
