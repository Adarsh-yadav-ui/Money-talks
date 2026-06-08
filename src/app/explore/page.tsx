"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { SellerName } from "@/components/SellerName";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const q = searchParams?.get("q") ?? "";
  const categorySlug = searchParams?.get("category") ?? "";

  const categories = useQuery(api.categories.list);
  const activeCategory = categories?.find((c) => c.slug === categorySlug);

  const products = useQuery(api.products.searchProducts, {
    query: q,
    categoryId: activeCategory?._id,
  });

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-heading text-foreground mb-2">
        {activeCategory ? activeCategory.name : "All Products"}
      </h1>
      {q && (
        <p className="text-foreground/60 font-base mb-8">
          Search results for &quot;{q}&quot;
        </p>
      )}
      {!q && !activeCategory && (
        <p className="text-foreground/60 font-base mb-8">
          Browse all digital products
        </p>
      )}

      {products === undefined ? (
        <p className="text-foreground font-base">Loading...</p>
      ) : products.length === 0 ? (
        <div className="border-2 border-border p-8 text-center">
          <p className="text-foreground font-base text-lg">No products found</p>
          <p className="text-foreground/40 font-base mt-2">
            {q
              ? `No results for "${q}". Try a different search term.`
              : "No products in this category yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/dashboard/products/${product.slug}`}
              className="block border-2 border-border bg-secondary-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-150"
            >
              <div className="aspect-4/3 border-b-2 border-border bg-main/20 flex items-center justify-center overflow-hidden">
                {product.coverImage ? (
                  <img
                    src={product.coverImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-main-foreground font-heading text-5xl">
                    {product.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-heading text-lg text-foreground truncate">
                  {product.name}
                </h3>
                <SellerName userId={product.sellerId} />
                <p className="text-foreground/60 font-base text-sm mt-1">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default function ExplorePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-foreground font-base">Loading...</p>
        </main>
      }>
        <ExploreContent />
      </Suspense>
    </>
  );
}
