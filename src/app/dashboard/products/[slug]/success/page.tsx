"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function PurchaseSuccessPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = useQuery(api.products.getBySlug, { slug });
  const hasPurchased = useQuery(
    api.purchases.hasPurchased,
    product ? { productId: product._id } : "skip",
  );
  const getDownload = useMutation(api.files.getProductDownload);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!product) return;
    setLoading(true);
    setError(null);
    try {
      const url = await getDownload({ productId: product._id });
      if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.download = product.fileName ?? product.files?.[0]?.name ?? "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      setError("Not available yet. Please try again in a few moments.");
    } finally {
      setLoading(false);
    }
  };

  if (hasPurchased === false) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="border-2 border-border bg-red-500 px-6 py-3 inline-block shadow-shadow">
            <span className="text-white font-heading text-lg">Access Denied</span>
          </div>
          <h1 className="text-4xl font-heading text-foreground">
            You haven't purchased this product
          </h1>
          <Button asChild variant="neutral">
            <Link href={`/dashboard/products/${slug}`}>Back to Product</Link>
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-2 border-border bg-main px-6 py-3 inline-block mb-6 shadow-shadow">
          <span className="text-main-foreground font-heading text-lg">Payment successful!</span>
        </div>
        <h1 className="text-4xl font-heading text-foreground mb-2">{product?.name}</h1>
        <p className="text-foreground/60 font-base mb-8">Thank you for your purchase</p>

        {product?.content && (
          <div
            className="text-foreground font-base leading-relaxed mb-8 border-2 border-border p-6 bg-secondary-background shadow-shadow prose-description"
            dangerouslySetInnerHTML={{ __html: product.content }}
          />
        )}

        {(product?.fileStorageId || product?.files?.length) && (
          <div className="border-2 border-border p-6 bg-secondary-background shadow-shadow mb-8">
            <h2 className="text-2xl font-heading mb-4">Downloads</h2>
            <p className="text-foreground font-base mb-4">
              {product?.files?.length
                ? `You have access to ${product.files.length} file(s).`
                : "Your download will be ready shortly."}
            </p>
            <Button onClick={handleDownload} disabled={loading}>
              {loading ? "Preparing download..." : "Download"}
            </Button>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        )}

        <div className="flex gap-3">
          <Button asChild variant="neutral">
            <Link href={`/dashboard/products/${slug}`}>Back to Product</Link>
          </Button>
          <Button asChild>
            <Link href="/purchases">All purchases</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
