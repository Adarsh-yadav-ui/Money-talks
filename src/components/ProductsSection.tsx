"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { SellerName } from "./SellerName";

export function ProductsSection() {
  const products = useQuery(api.products.listPublished);

  return (
    <section className="border-b-2 border-border bg-background py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-block border-2 border-border bg-main px-4 py-1 text-sm font-base text-main-foreground mb-4 shadow-shadow">
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
          {products === undefined ? (
            <p className="text-foreground font-base col-span-full">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-foreground/40 font-base col-span-full">No products yet.</p>
          ) : (
            products.slice(0, 8).map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}`}
                className="block border-2 border-border bg-secondary-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-150"
              >
                <div className="aspect-[4/3] border-b-2 border-border bg-main/20 flex items-center justify-center overflow-hidden">
                  {product.coverImage ? (
                    <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-main-foreground font-heading text-lg">
                      {product.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-foreground text-lg leading-tight mb-1 truncate">
                    {product.name}
                  </h3>
                  <SellerName userId={product.sellerId} />
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-heading text-xl text-foreground">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    <Button size="sm">Buy now</Button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
