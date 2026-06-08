"use client";

import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-block border-2 border-border bg-main px-4 py-1 text-sm font-base text-main-foreground mb-4">
            Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading text-foreground mb-2">
            Fair pricing for creators
          </h1>
          <p className="text-foreground/60 font-base">No monthly fees. No hidden charges. Just a flat fee per sale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="border-2 border-border bg-main p-8 shadow-shadow">
            <h2 className="text-2xl font-heading mb-2">Free to start</h2>
            <p className="text-5xl font-heading mb-2">10%</p>
            <p className="font-base text-main-foreground/70 mb-6">per sale</p>
            <ul className="flex flex-col gap-3 font-base text-sm">
              {["Unlimited products", "File storage included", "Instant payouts", "Buyer access control", "Rich text content"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="size-2 bg-main-foreground" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="reverse" size="lg" className="w-full mt-8 bg-main-foreground text-main border-main-foreground" asChild>
              <Link href="/sign-up">Start selling</Link>
            </Button>
          </div>

          <div className="border-2 border-border bg-secondary-background p-8 shadow-shadow">
            <h2 className="text-2xl font-heading mb-2">No hidden fees</h2>
            <p className="text-5xl font-heading mb-2">$0</p>
            <p className="font-base text-foreground/60 mb-6">per month</p>
            <ul className="flex flex-col gap-3 font-base text-sm">
              {["No setup fees", "No monthly charges", "No listing fees", "Cancel anytime", "Free buyer access"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="size-2 bg-foreground" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="neutral" size="lg" className="w-full mt-8" asChild>
              <Link href="/explore">Browse marketplace</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
