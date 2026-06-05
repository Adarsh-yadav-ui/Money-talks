import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative border-b-2 border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-block border-2 border-border bg-main px-4 py-1 text-sm font-base text-main-foreground mb-6">
            The creator economy platform
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading text-foreground leading-[0.9] tracking-tight">
            Sell digital
            <br />
            products.
            <span className="text-main block">Get paid.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-foreground/80 max-w-xl font-base leading-relaxed">
            Money Talks is the simplest way to sell ebooks, templates, presets,
            and any digital file. No setup fees, no monthly charges — just a
            marketplace that works for you.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start selling — it&apos;s free</Link>
            </Button>
            <Button variant="neutral" size="lg" asChild>
              <Link href="/explore">Browse products</Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm font-base text-foreground/60">
            <div className="flex items-center gap-2">
              <div className="size-2 bg-main border-2 border-border" />
              No monthly fees
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 bg-main border-2 border-border" />
              Instant payouts
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 bg-main border-2 border-border" />
              5% flat fee
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-1/3 h-full hidden lg:block">
        <div className="relative w-full h-full">
          <div className="absolute top-20 right-20 size-64 border-2 border-border bg-main rotate-12" />
          <div className="absolute top-40 right-40 size-48 border-2 border-border bg-secondary-background -rotate-6" />
          <div className="absolute bottom-20 right-32 size-36 border-2 border-border bg-background rotate-45" />
          <div className="absolute top-60 right-60 size-24 border-2 border-border bg-foreground" />
        </div>
      </div>
    </section>
  );
}
