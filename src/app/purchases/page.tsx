"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { SellerName } from "@/components/SellerName";
import { Button } from "@/components/ui/button";

export default function PurchasesPage() {
  const purchases = useQuery(api.purchases.getMyPurchases);

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-heading mb-8">My Purchases</h1>

        {purchases === undefined ? (
          <p className="text-foreground font-base">Loading...</p>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <p className="text-foreground font-base text-lg">
              You haven't purchased anything yet
            </p>
            <Button asChild variant="neutral">
              <Link href="/">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchases.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}/success`}
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
                    <span className="text-main-foreground font-heading text-4xl">
                      {product.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-heading text-lg truncate">
                    {product.name}
                  </h2>
                  <SellerName userId={product.sellerId} />
                  <p className="font-base text-sm text-foreground/60 mt-1">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                  {product.purchasedAt && (
                    <p className="font-base text-xs text-foreground/40 mt-1">
                      Purchased {new Date(product.purchasedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
