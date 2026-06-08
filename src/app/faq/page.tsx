"use client";

import { Navbar } from "@/components/Navbar";
import { ChevronRight } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    { q: "How does payment work?", a: "We use Polar for payment processing. Buyers pay via credit card or Polar balance. Sellers receive payouts directly to their Polar account." },
    { q: "What is the fee structure?", a: "Money Talks takes a flat 10% fee per transaction. There are no monthly fees, setup fees, or listing fees." },
    { q: "How do I start selling?", a: "Create an account, click 'Become a Seller' on your dashboard, then you can create and publish products." },
    { q: "How are files delivered?", a: "After purchase, buyers get access to download links and any rich text content you include with the product." },
    { q: "Can I update my products after publishing?", a: "Yes, you can edit your products from your dashboard at any time." },
    { q: "How do buyers access their purchases?", a: "Purchased products appear in the buyer's 'Purchases' page, where they can view content and download files." },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="inline-block border-2 border-border bg-main px-4 py-1 text-sm font-base text-main-foreground mb-4">
          FAQ
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading text-foreground mb-8">
          Frequently asked questions
        </h1>

        <div className="flex flex-col gap-4">
          {faqs.map((item, i) => (
            <div key={i} className="border-2 border-border p-6 bg-secondary-background shadow-shadow">
              <div className="flex items-start gap-3">
                <ChevronRight className="size-5 text-main shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading text-lg mb-2">{item.q}</h3>
                  <p className="text-foreground/60 font-base leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
