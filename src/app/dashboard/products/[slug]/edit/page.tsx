"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";

export default function EditProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const currentUser = useQuery(api.users.current);
  const product = useQuery(api.products.getBySlug, { slug });
  const updateProduct = useMutation(api.products.update);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (product === undefined) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center"><p className="text-foreground font-base">Loading...</p></main>
      </>
    );
  }

  if (!product || (currentUser && currentUser._id !== product.sellerId)) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center"><p className="text-foreground font-base">Not found</p></main>
      </>
    );
  }

  if (!initialized) {
    setName(product.name);
    setDescription(product.description);
    setPrice((product.price / 100).toFixed(2));
    setInitialized(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceInCents = Math.round(parseFloat(price) * 100);
    await updateProduct({
      id: product._id,
      name,
      description,
      price: priceInCents,
    });
    router.push(`/dashboard/products/${slug}`);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-heading mb-8">Edit Product</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 border-2 border-border p-6 bg-secondary-background shadow-shadow">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" type="number" step="0.01" min="0.5" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="flex gap-3">
            <Button type="submit">Save changes</Button>
            <Button variant="neutral" asChild>
              <a href={`/dashboard/products/${slug}`}>Cancel</a>
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
