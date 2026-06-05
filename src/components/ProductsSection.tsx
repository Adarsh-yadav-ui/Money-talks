import Link from "next/link";
import { Button } from "@/components/ui/button";

const products = [
  {
    title: "Notion CEO Dashboard",
    author: "Sarah Chen",
    price: 29,
    badge: "Best Seller",
    image: null,
  },
  {
    title: "Social Media Bundle 2025",
    author: "Marcus Rivera",
    price: 49,
    badge: "New",
    image: null,
  },
  {
    title: "Figma UI Component Kit",
    author: "Aisha Patel",
    price: 39,
    badge: null,
    image: null,
  },
  {
    title: "SEO Playbook",
    author: "James Wilson",
    price: 19,
    badge: "Popular",
    image: null,
  },
];

export function ProductsSection() {
  return (
    <section className="border-b-2 border-border bg-background py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-block border-2 border-border bg-main px-4 py-1 text-sm font-base text-main-foreground mb-4">
              Trending Now
            </div>
            <h2 className="text-4xl sm:text-5xl font-heading text-foreground">
              Popular products
            </h2>
          </div>
          <Button variant="neutral" asChild>
            <Link href="/explore">View all →</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.title}
              className="border-2 border-border bg-secondary-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-150"
            >
              <div className="aspect-[4/3] border-b-2 border-border bg-main flex items-center justify-center">
                <span className="text-main-foreground font-heading text-lg">
                  {product.title.substring(0, 2)}
                </span>
              </div>

              <div className="p-4">
                {product.badge && (
                  <span className="inline-block border border-border bg-main px-2 py-0.5 text-xs font-base text-main-foreground mb-2">
                    {product.badge}
                  </span>
                )}

                <h3 className="font-heading text-foreground text-lg leading-tight mb-1">
                  {product.title}
                </h3>

                <p className="text-sm text-foreground/60 font-base mb-3">
                  by {product.author}
                </p>

                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl text-foreground">
                    ${product.price}
                  </span>
                  <Button size="sm">Buy now</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
