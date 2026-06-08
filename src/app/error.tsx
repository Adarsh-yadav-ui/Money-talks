"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="border-2 border-border bg-red-500 px-6 py-3 inline-block shadow-shadow">
          <span className="text-white font-heading text-lg">Error</span>
        </div>
        <h1 className="text-5xl font-heading text-foreground">Something went wrong</h1>
        <p className="text-foreground/60 font-base max-w-md">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3">
          <Button variant="neutral" onClick={reset}>
            Try again
          </Button>
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
