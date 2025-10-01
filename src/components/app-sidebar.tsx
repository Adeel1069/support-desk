import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { User } from "@/generated/prisma";
import { getSidebarMenu } from "@/lib/utils";
import Logo from "./logo";
import Image from "next/image";

export function AppSidebar({ user }: { user: User }) {
  const menuItems = getSidebarMenu(user.role);
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="mt-2">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="mt-5 pl-5">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Image
          src="/logo.svg"
          alt="logo"
          width={120}
          height={120}
          className="opacity-40"
        />
      </SidebarFooter>
    </Sidebar>
  );
}
