'use client';
/** @format */

import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react"
import { usePathname } from "next/navigation";
import "./globals.css";
import NewHomeLayout from "@/app/newhome/layout"; // Import custom layout
import { cn } from "../lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    // Get the current route
    const pathname = usePathname();

    // Check if the route is "/dashboard" or a sub-route of "/dashboard"
    const isDashboardRoute = pathname.startsWith("/newhome");

    return (
        <html lang="en">
            <SessionProvider>
        <body
            className={cn(
                "min-h-screen w-full bg-white text-black flex flex-col",
                inter.className,
                {
                    "debug-screens": process.env.NODE_ENV === "development",
                }
            )}
        >
        {isDashboardRoute ? (
            // Use DashboardLayout for "/dashboard" routes
            <NewHomeLayout>{children}</NewHomeLayout>
        ) : (
            // Default layout for other routes
            <div className="flex flex-col">
                {children}
            </div>
        )}
        </body>
        </SessionProvider>
        </html>
    );
}
