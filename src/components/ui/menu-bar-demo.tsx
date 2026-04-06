"use client";

import {
  kineticNavGlowPresets,
  MenuBarKinetic,
} from "@/components/ui/menu-bar-kinetic";
import { Bell, Home, Settings, User } from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    icon: Home,
    label: "Home",
    href: "#",
    surface: "from-sky-500 to-blue-600",
    glow: kineticNavGlowPresets.skyBlue,
    iconColor: "text-blue-400",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "#",
    surface: "from-orange-400 to-amber-600",
    glow: kineticNavGlowPresets.orange,
    iconColor: "text-orange-400",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
    surface: "from-emerald-400 to-teal-600",
    glow:
      "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.34) 0%, rgba(22,163,74,0.12) 38%, rgba(21,128,61,0.04) 58%, transparent 72%)",
    iconColor: "text-emerald-400",
  },
  {
    icon: User,
    label: "Profile",
    href: "#",
    surface: "from-rose-400 to-red-600",
    glow:
      "radial-gradient(circle at 50% 50%, rgba(248,113,113,0.34) 0%, rgba(220,38,38,0.12) 38%, rgba(185,28,28,0.04) 58%, transparent 72%)",
    iconColor: "text-red-400",
  },
];

/** Демо кинетического меню; подключите на странице при необходимости: `<MenuBarDemo />` */
export function MenuBarDemo() {
  const [activeItem, setActiveItem] = useState<string>("Home");

  return (
    <MenuBarKinetic
      items={menuItems}
      activeItem={activeItem}
      onItemClick={setActiveItem}
    />
  );
}
