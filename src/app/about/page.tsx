"use client";

import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="inline-block border-2 border-border bg-main px-4 py-1 text-sm font-base text-main-foreground mb-4">
          About
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading text-foreground mb-8">
          Money Talks
        </h1>

        <div className="flex flex-col gap-6">
          <div className="border-2 border-border p-6 bg-secondary-background shadow-shadow">
            <h2 className="text-2xl font-heading mb-3">Our Story</h2>
            <p className="text-foreground/80 font-base leading-relaxed">
              Money Talks is a digital products marketplace built for creators. We believe anyone should be able to sell their work online without paying monthly fees or dealing with complicated setups.
            </p>
          </div>

          <div className="border-2 border-border p-6 bg-secondary-background shadow-shadow">
            <h2 className="text-2xl font-heading mb-3">Our Mission</h2>
            <p className="text-foreground/80 font-base leading-relaxed">
              Our platform handles everything from payment processing to file delivery, so you can focus on creating. With a flat 10% fee, we only make money when you do.
            </p>
          </div>

          <div className="border-2 border-border p-6 bg-secondary-background shadow-shadow">
            <h2 className="text-2xl font-heading mb-3">Join Us</h2>
            <p className="text-foreground/80 font-base leading-relaxed mb-4">
              Founded in 2025, we are a small team passionate about empowering creators worldwide.
            </p>
            <Button asChild>
              <Link href="/sign-up">Start selling</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
