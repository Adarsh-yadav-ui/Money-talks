"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { SellerName } from "@/components/SellerName";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useAction } from "convex/react";

export default function CartPage() {
  const cart = useQuery(api.cart.getCart);
  const removeItem = useMutation(api.cart.removeItem);
  const clearCart = useMutation(api.cart.clearCart);
  const generateCartCheckoutUrl = useAction(api.billing.generateCartCheckoutUrl);
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!cart || cart.length === 0) return;
    setCheckingOut(true);
    try {
      const origin = window.location.origin;
      const url = await generateCartCheckoutUrl({
        productIds: cart.map((item) => item.productId),
        successUrl: `${origin}/cart/success`,
        returnUrl: `${origin}/cart`,
      });
      window.location.href = url;
    } catch (err) {
      console.error("Checkout failed", err);
      setCheckingOut(false);
    }
  };

  const total = (cart ?? []).reduce(
    (sum, item) => sum + (item.product?.price ?? 0),
    0,
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-heading mb-8">Cart</h1>

        {cart === undefined ? (
          <p className="text-foreground font-base">Loading...</p>
        ) : cart.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <p className="text-foreground font-base text-lg">Your cart is empty</p>
            <Button asChild variant="neutral">
              <Link href="/dashboard">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="border-2 border-border bg-secondary-background p-4 flex items-center gap-4 shadow-shadow"
              >
                <div className="w-16 h-16 border-2 border-border bg-main/20 flex items-center justify-center shrink-0">
                  {item.product?.coverImage ? (
                    <img
                      src={item.product.coverImage}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-main-foreground font-heading text-lg">
                      {item.product?.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/dashboard/products/${item.product?.slug}`}
                    className="font-heading text-lg truncate block hover:underline"
                  >
                    {item.product?.name}
                  </Link>
                  {item.product && <SellerName userId={item.product.sellerId} />}
                  <p className="font-base text-sm text-foreground/60">
                    ${((item.product?.price ?? 0) / 100).toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => removeItem({ cartId: item._id })}
                >
                  Remove
                </Button>
              </div>
            ))}

            <div className="border-t-2 border-border pt-4 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="font-heading text-xl shrink-0">
                Total: ${(total / 100).toFixed(2)}
              </span>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button variant="neutral" onClick={() => clearCart()} className="flex-1 sm:flex-initial">
                  Clear
                </Button>
                <Button onClick={handleCheckout} disabled={checkingOut} className="flex-1 sm:flex-initial">
                  {checkingOut ? "Redirecting..." : "Checkout"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
