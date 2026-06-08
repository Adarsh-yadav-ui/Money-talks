"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextArea } from "@/components/RichTextArea";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = [
  "application/zip", "application/pdf", "video/mp4",
  "image/jpeg", "image/png", "image/gif", "image/svg+xml",
  "audio/mpeg", "audio/wav", "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ALLOWED_EXTENSIONS = ".zip,.pdf,.mp4,.jpg,.jpeg,.png,.gif,.svg,.mp3,.wav,.csv,.xlsx,.docx,.txt";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.string().refine((v) => {
    const n = parseFloat(v);
    return !isNaN(n) && n >= 0.5;
  }, "Price must be at least $0.50"),
});

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState<string | null>(null);

  const currentUser = useQuery(api.users.current);
  const categories = useQuery(api.categories.list);
  const seedCategories = useMutation(api.categories.seed);
  const createProduct = useAction(api.billing.createProduct);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getFileUrl);

  useEffect(() => {
    if (open && categories && categories.length === 0) {
      seedCategories();
    }
  }, [open, categories, seedCategories]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const selected = Array.from(e.target.files ?? []);
    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`"${file.name}" exceeds the 50MB limit.`);
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFileError(`"${file.name}" has an unsupported file type.`);
        return;
      }
    }
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > 5 * 1024 * 1024) {
      setFileError("Cover image must be under 5MB.");
      return;
    }
    if (file && !file.type.startsWith("image/")) {
      setFileError("Cover image must be an image file.");
      return;
    }
    setFileError(null);
    setCoverFile(file);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const parsed = productSchema.safeParse({ name, price });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setCreating(true);
    setResult(null);

    try {
      const priceInCents = Math.round(parseFloat(price) * 100);

      let coverImage: string | undefined;

      if (coverFile) {
        const coverUploadUrl = await generateUploadUrl();
        const coverRes = await fetch(coverUploadUrl, { method: "POST", body: coverFile });
        if (!coverRes.ok) throw new Error("Failed to upload cover image");
        const { storageId } = await coverRes.json();
        const url = await getFileUrl({ storageId });
        if (url) coverImage = url;
      }

      const uploaded = await Promise.all(
        files.map(async (file) => {
          const uploadUrl = await generateUploadUrl();
          const res = await fetch(uploadUrl, { method: "POST", body: file });
          if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
          const { storageId } = await res.json();
          return { storageId, name: file.name, size: file.size };
        })
      );

      const res = await createProduct({
        sellerId: currentUser._id,
        name,
        description,
        content: content || undefined,
        price: priceInCents,
        coverImage,
        categoryId: (categoryId || undefined) as any,
        files: uploaded,
        fileStorageId: uploaded[0]?.storageId,
        fileName: uploaded[0]?.name,
      });
      setResult(`Product created! (ID: ${res.productId})`);
      setName("");
      setDescription("");
      setContent("");
      setPrice("");
      setCategoryId("");
      setFiles([]);
      setCoverFile(null);
    } catch (err) {
      setResult("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Product</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto px-1">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="My Awesome Product"
              required
            />
            {errors.name && (
              <p className="text-sm text-red-500 font-base">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your product..."
              rows={4}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="content">Product Content (optional)</Label>
            <p className="text-xs text-foreground/60">
              Rich text content buyers get access to after purchase.
            </p>
            <RichTextArea value={content} onChange={setContent} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0.5"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
              }}
              placeholder="9.99"
              required
            />
            {errors.price && (
              <p className="text-sm text-red-500 font-base">{errors.price}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Cover Image (optional) <span className="text-foreground/40 text-xs">(max 5MB)</span></Label>
            <Input
              id="cover"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
            />
            {coverPreview && (
              <div className="aspect-4/3 border-2 border-border mt-1 overflow-hidden">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Product Files (max 5) <span className="text-foreground/40 text-xs">(max 50MB each)</span></Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={handleFileChange}
              accept={ALLOWED_EXTENSIONS}
            />
            {fileError && (
              <p className="text-sm text-red-500 font-base">{fileError}</p>
            )}
            {files.length > 0 && (
              <ul className="flex flex-col gap-1 mt-1">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between text-sm border-2 border-border px-2 py-1">
                    <span className="truncate">{f.name}</span>
                    <button type="button" onClick={() => removeFile(i)} className="text-red-500 ml-2">&times;</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button type="submit" disabled={creating} className="w-full">
            {creating ? "Uploading & Creating..." : "Create Product"}
          </Button>
          {result && (
            <p className="text-sm font-base">{result}</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
