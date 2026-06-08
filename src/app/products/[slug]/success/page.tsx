"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PurchaseSuccessPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = useQuery(api.products.getBySlug, { slug });
  const getDownload = useMutation(api.files.getProductDownload);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!product) return;
    setDownloading(true);
    setError(null);
    try {
      const url = await getDownload({ productId: product._id });
      if (url) {
        const fileName = product.fileName ?? product.files?.[0]?.name ?? "download";
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      setError("Not available yet. Please try again in a few moments.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="border-2 border-border bg-main px-6 py-3 inline-block">
          <span className="text-main-foreground font-heading text-lg">
            Payment successful!
          </span>
        </div>
        <h1 className="text-4xl font-heading text-foreground">
          Thank you for your purchase
        </h1>
        <p className="text-foreground font-base max-w-md">
          {product?.files?.length
            ? `You have access to ${product.files.length} file(s). Click below to download.`
            : product?.fileStorageId
              ? "Your download will be ready shortly."
              : "This product has no file attached."}
        </p>
        {(product?.fileStorageId || product?.files?.length) && (
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? "Preparing download..." : "Download"}
          </Button>
        )}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <Button asChild variant="neutral">
          <a href={`/dashboard/products/${slug}`}>Back to Product</a>
        </Button>
      </main>
    </>
  );
}
