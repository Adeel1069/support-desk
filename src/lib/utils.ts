import { HelpCircle, Home, Layers, Ticket, Users } from "lucide-react";
import { Role } from "@/generated/prisma";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const sidebarMenuConfig = {
  [Role.ADMIN]: [
    { title: "Dashboard", url: "/admin/dashboard", icon: Home },
    { title: "Tickets", url: "/admin/tickets", icon: Ticket },
    { title: "Category", url: "/admin/categories", icon: Layers },
    { title: "Users", url: "/admin/users", icon: Users },
  ],
  [Role.AGENT]: [
    { title: "Dashboard", url: "/agent/dashboard", icon: Home },
    { title: "Tickets", url: "/agent/tickets", icon: Ticket },
  ],
  [Role.USER]: [
    { title: "Dashboard", url: "/user/dashboard", icon: Home },
    { title: "My Tickets", url: "/user/tickets", icon: Ticket },
    { title: "Help", url: "/user/help", icon: HelpCircle },
  ],
};

// Get sidebar menu items based on logged in user role
export function getSidebarMenu(role: Role) {
  return sidebarMenuConfig[role] ?? [];
}
