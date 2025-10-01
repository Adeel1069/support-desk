import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/actions/auth-actions";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Support Desk",
  description: "Scalable and adaptable support management system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: user } = await getCurrentUser();

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SidebarProvider>
            {/* shadcn app sidebar */}
            {user && <AppSidebar user={user} />}
            <main className="w-full">
              {/* Custom navbar with shadcn SidebarTrigger */}
              <Navbar />
              <main>{children}</main>
            </main>
          </SidebarProvider>
          <Toaster position="top-center" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
