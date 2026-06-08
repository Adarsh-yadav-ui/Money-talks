"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="border-2 border-border bg-main px-6 py-3 inline-block shadow-shadow">
          <span className="text-main-foreground font-heading text-lg">404</span>
        </div>
        <h1 className="text-5xl font-heading text-foreground">Page not found</h1>
        <p className="text-foreground/60 font-base max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="neutral">
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild>
            <Link href="/explore">Browse products</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
