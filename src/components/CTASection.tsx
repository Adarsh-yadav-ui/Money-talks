import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="border-b-2 border-border bg-background py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="border-2 border-border bg-main p-8 md:p-12 shadow-shadow">
          <h2 className="text-4xl sm:text-5xl font-heading text-main-foreground">
            Ready to start selling?
          </h2>
          <p className="mt-4 text-lg text-main-foreground/80 font-base max-w-xl mx-auto">
            Join thousands of creators already using Money Talks. Set up your
            store in minutes and start earning today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="reverse"
              size="lg"
              className="bg-main-foreground text-main border-main-foreground"
              asChild
            >
              <Link href="/sign-up">Create your store</Link>
            </Button>
            <Button
              variant="noShadow"
              size="lg"
              className="bg-transparent text-main-foreground border-2 border-main-foreground hover:bg-main-foreground hover:text-main"
              asChild
            >
              <Link href="/explore">Browse marketplace</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
