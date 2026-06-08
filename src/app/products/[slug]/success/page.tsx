"use client";

import { useParams, redirect } from "next/navigation";

export default function OldSuccessPage() {
  const { slug } = useParams<{ slug: string }>();
  redirect(`/dashboard/products/${slug}/success`);
}
