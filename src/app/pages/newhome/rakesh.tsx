'use client';
/** @format */

import { SessionProvider } from "next-auth/react"
import "../globals.css";
import SideNavbar from "@/components/SideNavbar";
import Header from "@/components/Header";

export default function NewHomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
            >
                {/* Header */}
                {/* <Header userName="Rakesh" /> */}

                {/* Main Layout */}
                <div className="flex flex-row flex-1">
                    {/* Sidebar */}
                    {/* <SideNavbar /> */}
                    {/* Main Content */}
                    <SessionProvider>{children}</SessionProvider>
                </div>
            </body>
        </html>
    );
}
