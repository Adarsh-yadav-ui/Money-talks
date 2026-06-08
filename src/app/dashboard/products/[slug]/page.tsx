"use client";

import { useQuery, useAction } from "convex/react";
import { api } from "@convex/_generated/api";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = useQuery(api.products.getBySlug, { slug });
  const seller = useQuery(
    api.users.get,
    product ? { id: product.sellerId } : "skip",
  );
  const generateCheckoutUrl = useAction(api.billing.generateCheckoutUrl);
  const [loading, setLoading] = useState(false);

  if (product === undefined) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-foreground font-base">Loading...</p>
        </main>
      </>
    );
  }

  if (product === null) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-foreground font-base">Product not found</p>
        </main>
      </>
    );
  }

  const handleBuy = async () => {
    setLoading(true);
    try {
      const origin = window.location.origin;
      const successUrl = `${origin}/products/${slug}/success`;
      const returnUrl = `${origin}/products/${slug}`;
      const url = await generateCheckoutUrl({
        productId: product._id,
        successUrl,
        returnUrl,
      });
      window.location.href = url;
    } catch (err) {
      console.error("Checkout failed", err);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-4/3 border-2 border-border bg-main flex items-center justify-center">
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

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-heading text-foreground mb-2">
                {product.name}
              </h1>
              {seller && (
                <p className="text-foreground/60 font-base">
                  by {seller.firstName} {seller.lastName}
                </p>
              )}
            </div>

            <div
              className="prose-description text-foreground font-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            <div className="border-t-2 border-border pt-6">
              <div className="text-3xl font-heading text-foreground mb-4">
                ${(product.price / 100).toFixed(2)}
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleBuy}
                disabled={loading}
              >
                {loading ? "Redirecting to checkout..." : "Buy now"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
