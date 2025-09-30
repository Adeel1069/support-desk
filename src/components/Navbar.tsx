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

const Navbar = async () => {
  const { isAuthenticated } = await auth();
  if (isAuthenticated) await syncUser(); // To sync a Clerk user with our database

  return (
    <header className="flex justify-between items-center border-b border-gray-100 p-3 px-3 md:px-5 lg:px-10">
      {isAuthenticated ? (
        <SidebarTrigger className="hover:cursor-pointer" />
      ) : (
        <Logo />
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
          <UserButton />
        </SignedIn>
      </section>
    </header>
  );
};

export default Navbar;
