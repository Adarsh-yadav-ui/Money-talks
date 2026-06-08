"use client";

import { Navbar } from "@/components/Navbar";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="inline-block border-2 border-border bg-main px-4 py-1 text-sm font-base text-main-foreground mb-4">
          Contact
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading text-foreground mb-8">
          Get in touch
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-border p-6 bg-secondary-background shadow-shadow">
            <div className="size-12 border-2 border-border bg-main flex items-center justify-center mb-4">
              <Mail className="size-6 text-main-foreground" />
            </div>
            <h2 className="text-xl font-heading mb-2">Email</h2>
            <p className="text-foreground/60 font-base">hello@moneytalks.com</p>
            <p className="text-foreground/40 font-base text-sm mt-1">We reply within 24 hours</p>
          </div>

          <div className="border-2 border-border p-6 bg-secondary-background shadow-shadow">
            <div className="size-12 border-2 border-border bg-main flex items-center justify-center mb-4">
              <MessageSquare className="size-6 text-main-foreground" />
            </div>
            <h2 className="text-xl font-heading mb-2">Live chat</h2>
            <p className="text-foreground/60 font-base">Coming soon</p>
            <p className="text-foreground/40 font-base text-sm mt-1">Chat support is on its way</p>
          </div>
        </div>
      </main>
    </>
  );
}
