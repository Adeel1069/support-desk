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

const Navbar = async () => {
  const { isAuthenticated } = await auth();
  if (isAuthenticated) await syncUser(); // To sync a Clerk user with our database

  return (
    <header className="flex justify-between items-center p-3 border-b">
      {isAuthenticated ? (
        <SidebarTrigger className="hover:cursor-pointer" />
      ) : (
        <div>Logo</div>
      )}
      <section className="flex items-center gap-5">
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <button>Sign Up</button>
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
