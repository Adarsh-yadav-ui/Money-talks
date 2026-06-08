"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function SellerPage() {
  const { email } = useParams<{ email: string }>();
  const decodedEmail = decodeURIComponent(email);
  const seller = useQuery(api.users.getByEmail, { email: decodedEmail });
  const products = useQuery(api.products.listBySellerEmail, {
    email: decodedEmail,
  });

  if (!seller && products === undefined) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-foreground font-base">Loading...</p>
        </main>
      </>
    );
  }

  if (!seller) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-foreground font-base">Seller not found</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-heading text-foreground mb-2">
            {seller.firstName} {seller.lastName}
          </h1>
          <p className="text-foreground/60 font-base">{seller.email}</p>
        </div>

        {products && products.length === 0 && (
          <p className="text-foreground/40 font-base text-lg">
            No products yet.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <Link
              key={product._id}
              href={`/dashboard/products/${product.slug}`}
              className="block border-2 border-border bg-secondary-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-150"
            >
              <div className="aspect-4/3 border-b-2 border-border bg-main flex items-center justify-center">
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
                <h3 className="text-lg font-heading text-foreground truncate">
                  {product.name}
                </h3>
                <p className="text-foreground/40 font-base text-sm">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
