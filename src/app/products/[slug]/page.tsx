"use client";

import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

export default function PublicProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const currentUser = useQuery(api.users.current);
  const product = useQuery(api.products.getBySlug, { slug });
  const seller = useQuery(
    api.users.get,
    product ? { id: product.sellerId } : "skip",
  );
  const generateCheckoutUrl = useAction(api.billing.generateCheckoutUrl);
  const addToCart = useMutation(api.cart.addItem);
  const [buyLoading, setBuyLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const isOwner = currentUser && product && currentUser._id === product.sellerId;

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

  if (product === null || product.status !== "published") {
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
    setBuyLoading(true);
    try {
      const origin = window.location.origin;
      const url = await generateCheckoutUrl({
        productId: product._id,
        successUrl: `${origin}/products/${slug}/success`,
        returnUrl: `${origin}/products/${slug}`,
      });
      window.location.href = url;
    } catch (err) {
      console.error("Checkout failed", err);
      setBuyLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setCartLoading(true);
    try {
      await addToCart({ productId: product._id });
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-4/3 border-2 border-border bg-main flex items-center justify-center shadow-shadow">
            {product.coverImage ? (
              <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover" />
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
                <Link href={`/dashboard/seller/${seller.email}`} className="text-foreground/60 font-base hover:underline">
                  by {seller.firstName} {seller.lastName}
                </Link>
              )}
            </div>

            <p className="text-foreground font-base leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>

            <div className="border-t-2 border-border pt-6">
              <div className="text-3xl font-heading text-foreground mb-4">
                ${(product.price / 100).toFixed(2)}
              </div>

              {isOwner ? (
                <p className="text-sm text-foreground/40 font-base">You own this product</p>
              ) : (
                <div className="flex gap-3">
                  <Button size="lg" className="flex-1" variant="neutral" onClick={handleAddToCart} disabled={cartLoading}>
                    {cartLoading ? "Adding..." : "Add to Cart"}
                  </Button>
                  <Button size="lg" className="flex-1" onClick={handleBuy} disabled={buyLoading}>
                    {buyLoading ? "Redirecting..." : "Buy now"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
