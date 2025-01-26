/** @format */
"use client";

import { useState } from "react";
import { Nav } from "./ui/nav";
import { useSession } from "next-auth/react"; // Import session hook
import {
  ShoppingCart,
  LayoutDashboard,
  UsersRound,
  Settings,
  ChevronRight,
  Brain,
} from "lucide-react";
import { Button } from "./ui/button";
import { useWindowWidth } from "@react-hook/window-size";

type Props = {};

export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  // Fetch session data
  const { data: session } = useSession();
  const userId = session?.user?.id; // Assuming the session contains `user.id`

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className="relative min-w-[80px] border-r px-3 pb-10 pt-4">
      {!mobileWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className=" rounded-full p-2"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: "Dashboard",
            href: "/pages/dashboard",
            icon: LayoutDashboard,
            variant: "default",
          },
          {
            title: "Add Expense",
            // Pass userId to the Add Expense route
            href: `/pages/addexpense?userId=${userId}`,
            icon: UsersRound,
            variant: "ghost",
          },
          {
            title: "AI Suggestions",
            href: "/pages/aisuggestions",
            icon: Brain,
            variant: "ghost",
          },
          {
            title: "Settings",
            href: "/pages/dashboard",
            icon: Settings,
            variant: "ghost",
          },
        ]}
      />
    </div>
  );
}
