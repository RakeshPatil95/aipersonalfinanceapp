'use client';
/** @format */

import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react"
import "../globals.css";
import { cn } from "@/lib/utils";
import SideNavbar from "@/components/SideNavbar";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function AddExpensesLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body
            className={cn(
                "min-h-screen w-full bg-white text-black flex flex-col",
                inter.className,
                {
                    "debug-screens": process.env.NODE_ENV === "development",
                }
            )}
        >
        {/* Header
        <Header userName="Rakesh" /> */}
        
        {/* Main Layout */}
        <div className="flex flex-row flex-1">
            {/* Sidebar */}
            <SideNavbar />
            {/* Main Content */}
            <SessionProvider>{children}</SessionProvider>
            </div>
        </body>
        </html>
    );
}
