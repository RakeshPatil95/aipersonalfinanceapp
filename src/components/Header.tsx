'use client';
import { Button } from "@/components/ui/button";

interface HeaderProps {
    userName: string;
}

// Header Component
export default function Header({ userName }: HeaderProps) {
    // Handle sign-out
    const handleSignOut = async () => {
        await fetch("/signout", { method: "POST" });
        window.location.href = "/signin"; // Redirect to the signin page
    };

    return (
        <header className="flex justify-between items-center bg-gray-100 py-2 px-4 rounded-md shadow-sm">
            <h1 className="text-lg font-semibold">Welcome {userName}</h1>
            <div className="flex gap-4 items-center">
                <Button variant="destructive" onClick={handleSignOut}>
                    Sign Out
                </Button>
            </div>
        </header>

    );
}
