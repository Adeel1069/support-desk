"use client";

import Features from "@/components/landing-page/features";
import Footer from "@/components/landing-page/footer";
import HeroSection from "@/components/landing-page/hero-section";
import HowItWorks from "@/components/landing-page/how-it-works";
import WhyUse from "@/components/landing-page/why-use";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-20 md:gap-24 lg:gap-28">
      <HeroSection />
      <Features />
      <HowItWorks />
      <WhyUse />
      <Footer />
    </main>
  );
}
