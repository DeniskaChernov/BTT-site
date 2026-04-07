"use client";

import { MenuBar, menuBarGradientPresets } from "@/components/ui/menu-bar";
import { Bell, Home, Settings, User } from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    icon: Home,
    label: "Home",
    href: "#",
    gradient: menuBarGradientPresets.home,
    iconColor: "text-sky-400",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "#",
    gradient:
      "linear-gradient(135deg, #fb923c 0%, #f59e0b 100%)",
    iconColor: "text-orange-400",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
    gradient:
      "linear-gradient(135deg, #34d399 0%, #059669 100%)",
    iconColor: "text-emerald-400",
  },
  {
    icon: User,
    label: "Profile",
    href: "#",
    gradient:
      "linear-gradient(135deg, #fb7185 0%, #dc2626 100%)",
    iconColor: "text-red-400",
  },
];

/** Демо кинетического меню; при необходимости: `<MenuBarDemo />` */
export function MenuBarDemo() {
  const [activeItem, setActiveItem] = useState<string>("Home");

  return (
    <MenuBar
      items={menuItems}
      activeItem={activeItem}
      onItemClick={setActiveItem}
    />
  );
}
