"use client";

import { Navbar } from "@/components/Navbar";

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="inline-block border-2 border-border bg-main px-4 py-1 text-sm font-base text-main-foreground mb-4">
          Blog
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading text-foreground mb-2">
          Tips & tutorials
        </h1>
        <p className="text-foreground/60 font-base mb-8">Stories and guides from creators.</p>

        <div className="border-2 border-border p-8 bg-secondary-background shadow-shadow text-center">
          <p className="text-foreground/40 font-base text-lg mb-2">No posts yet</p>
          <p className="text-foreground/40 font-base text-sm">Blog posts are coming soon. Check back later!</p>
        </div>
      </main>
    </>
  );
}
