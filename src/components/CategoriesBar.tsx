"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function CategoriesBar() {
  const categories = useQuery(api.categories.list);
  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get("category") ?? "";
  const [search, setSearch] = useState(searchParams?.get("q") ?? "");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (activeCategory) params.set("category", activeCategory);
    const qs = params.toString();
    router.push(qs ? `/explore?${qs}` : "/explore");
  };

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (slug && slug !== activeCategory) {
      params.set("category", slug);
    }
    const qs = params.toString();
    router.push(qs ? `/explore?${qs}` : "/explore");
  };

  return (
    <div className="border-b-2 border-border bg-secondary-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleCategoryClick("")}
            className={`shrink-0 text-xs sm:text-sm font-heading px-3 py-1.5 border-2 transition-colors ${
              !activeCategory
                ? "bg-main text-main-foreground border-border"
                : "bg-background text-foreground border-transparent hover:border-border"
            }`}
          >
            All
          </button>
          {categories?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`shrink-0 text-xs sm:text-sm font-heading px-3 py-1.5 border-2 transition-colors whitespace-nowrap ${
                activeCategory === cat.slug
                  ? "bg-main text-main-foreground border-border"
                  : "bg-background text-foreground border-transparent hover:border-border"
              }`}
            >
              {cat.name}
            </button>
          ))}

          <div className="ml-auto shrink-0">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-40 sm:w-56 h-8 pl-8 text-sm border-2 border-border bg-background rounded-none"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
