"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartSuccessPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center"><p className="text-foreground font-base">Loading...</p></main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="border-2 border-border bg-main px-6 py-3 inline-block mb-6 shadow-shadow">
          <span className="text-main-foreground font-heading text-lg">Payment successful!</span>
        </div>
        <h1 className="text-4xl font-heading mb-4">Thank you for your purchase</h1>
        <p className="text-foreground/60 font-base mb-8 max-w-md mx-auto">
          Your products are now available in your purchases. You can access them anytime from your account.
        </p>
        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <Button asChild variant="neutral">
            <Link href="/purchases">View purchases</Link>
          </Button>
          <Button asChild>
            <Link href="/explore">Browse more products</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
