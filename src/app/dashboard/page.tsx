"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { api } from "@convex/_generated/api";
import { CreateProductDialog } from "@/components/CreateProductDialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";

export default function DashboardPage() {
  const currentUser = useQuery(api.users.current);
  const becomeSeller = useMutation(api.users.becomeSeller);
  const seedCategories = useMutation(api.categories.seed);
  const categories = useQuery(api.categories.list);
  const myProducts = useQuery(
    api.products.getMyProducts,
    currentUser?._id ? { sellerId: currentUser._id } : "skip",
  );

  useEffect(() => {
    if (categories && categories.length === 0) {
      seedCategories();
    }
  }, [categories, seedCategories]);

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-heading">Dashboard</h1>
          {currentUser?.role === "creator" && <CreateProductDialog />}
        </div>

        {currentUser?.role === "creator" ? (
          <div className="flex flex-col gap-8">
            {myProducts === undefined ? (
              <p className="text-foreground font-base">Loading products...</p>
            ) : myProducts.length === 0 ? (
              <p className="text-foreground font-base">
                No products yet. Click "Create Product" to get started.
              </p>
            ) : (
              categories?.map((cat) => {
                const catProducts = myProducts.filter(
                  (p) => p.categoryId === cat._id,
                );
                if (catProducts.length === 0) return null;
                return (
                  <section key={cat._id}>
                    <h2 className="text-2xl font-heading mb-4">{cat.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {catProducts.map((product) => (
                        <Link
                          key={product._id}
                          href={`/dashboard/products/${product.slug}`}
                          className="border-2 border-border bg-secondary-background hover:bg-main/10 transition-colors"
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
                            <h3 className="font-heading text-lg truncate">
                              {product.name}
                            </h3>
                            <p className="font-base text-sm text-foreground/60 mt-1">
                              ${(product.price / 100).toFixed(2)}
                            </p>
                            <p className="font-base text-xs text-foreground/40 mt-1">
                              {product.status}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })
            )}

            {/* Uncategorized products */}
            {myProducts &&
              myProducts.some((p) => !p.categoryId) && (
                <section>
                  <h2 className="text-2xl font-heading mb-4">Uncategorized</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myProducts
                      .filter((p) => !p.categoryId)
                      .map((product) => (
                        <Link
                          key={product._id}
                          href={`/dashboard/products/${product.slug}`}
                          className="border-2 border-border bg-secondary-background hover:bg-main/10 transition-colors"
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
                            <h3 className="font-heading text-lg truncate">
                              {product.name}
                            </h3>
                            <p className="font-base text-sm text-foreground/60 mt-1">
                              ${(product.price / 100).toFixed(2)}
                            </p>
                            <p className="font-base text-xs text-foreground/40 mt-1">
                              {product.status}
                            </p>
                          </div>
                        </Link>
                      ))}
                  </div>
                </section>
              )}
          </div>
        ) : (
          <>
            <p className="text-foreground font-base">
              {currentUser?.role === "buyer"
                ? "Welcome to your dashboard."
                : "Loading..."}
            </p>
            {currentUser?.role === "buyer" && (
              <Button onClick={() => becomeSeller()} className="mt-4">
                Become a Seller
              </Button>
            )}
          </>
        )}
      </main>
    </>
  );
}
