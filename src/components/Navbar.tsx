import { syncUser } from "@/actions/auth-actions";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import Logo from "./logo";
import { Bell } from "lucide-react";

const Navbar = async () => {
  const { isAuthenticated } = await auth();
  if (isAuthenticated) {
    // TODO - move syncing logic to middleware
    await syncUser(); // To sync a Clerk user with our database
  }

  return (
    <header className="flex justify-between items-center border-b border-gray-100 p-3 pr-3 md:pr-5 lg:pr-10">
      {isAuthenticated ? (
        <SidebarTrigger />
      ) : (
        <div className="pl-3 md:pl-5 lg:pl-10">
          <Logo />
        </div>
      )}
      <section className="flex items-center gap-5">
        <SignedOut>
          <SignInButton>
            <Button size="lg">Log In</Button>
          </SignInButton>
          <SignUpButton>
            <Button size="lg" variant="outline">
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <Bell className="text-primary hover:cursor-pointer" />
          <UserButton />
        </SignedIn>
      </section>
    </header>
  );
};

export default Navbar;
