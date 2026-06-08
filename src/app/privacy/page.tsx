"use client";

import { Navbar } from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="inline-block border-2 border-border bg-main px-4 py-1 text-sm font-base text-main-foreground mb-4">
          Legal
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading text-foreground mb-8">
          Privacy Policy
        </h1>

        <div className="border-2 border-border p-6 bg-secondary-background shadow-shadow flex flex-col gap-4">
          <p className="text-foreground/70 font-base leading-relaxed">We respect your privacy. We only collect information necessary to provide our service.</p>
          <p className="text-foreground/70 font-base leading-relaxed">Your data is stored securely and is never shared with third parties except as required for payment processing (Polar) and authentication (Clerk).</p>
          <p className="text-foreground/70 font-base leading-relaxed">We do not sell your personal information to advertisers or any third parties.</p>
          <div className="border-t-2 border-border pt-4 text-foreground/40 font-base text-sm">Last updated: June 2026</div>
        </div>
      </main>
    </>
  );
}
