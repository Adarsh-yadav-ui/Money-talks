"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useRouter } from "next/navigation";

export function SellerName({ userId }: { userId: string }) {
  const router = useRouter();
  const seller = useQuery(api.users.get, { id: userId as any });

  if (!seller) return null;

  return (
    <div
      onClick={() => router.push(`/dashboard/seller/${seller.email}`)}
      className="text-xs text-foreground/40 font-base hover:text-foreground/60 hover:underline transition-colors"
    >
      by {seller.firstName} {seller.lastName}
    </div>
  );
}
