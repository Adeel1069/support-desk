import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="w-full bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Support Desk</h1>
          <p className="text-lg text-slate-500 mb-6">
            A simple and modern powerful ticketing system designed to manage
            support requests efficiently.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <SignInButton>
              <Button size="lg">Log In</Button>
            </SignInButton>
            <Button asChild size="lg" variant="outline">
              <Link href="/user/dashboard">Create a Ticket</Link>
            </Button>
          </div>
        </div>

        {/* Right Content - Responsive Image */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-full max-w-md h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
            <Image
              src="/support-desk.png"
              alt="Support Desk Illustration"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
