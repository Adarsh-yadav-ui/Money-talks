"use client";

import { Navbar } from "@/components/Navbar";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="inline-block border-2 border-border bg-main px-4 py-1 text-sm font-base text-main-foreground mb-4">
          Legal
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading text-foreground mb-8">
          Terms of Service
        </h1>

        <div className="border-2 border-border p-6 bg-secondary-background shadow-shadow flex flex-col gap-4">
          <p className="text-foreground/70 font-base leading-relaxed">These terms govern your use of the Money Talks platform. By using our service, you agree to these terms.</p>
          <p className="text-foreground/70 font-base leading-relaxed">Creators are responsible for the products they list. Buyers agree to respect copyright and intellectual property rights.</p>
          <p className="text-foreground/70 font-base leading-relaxed">Money Talks reserves the right to remove listings that violate our policies.</p>
          <div className="border-t-2 border-border pt-4 text-foreground/40 font-base text-sm">Last updated: June 2026</div>
        </div>
      </main>
    </>
  );
}
