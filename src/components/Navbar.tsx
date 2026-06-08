"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function Navbar() {
  const currentUser = useQuery(api.users.current);
  const NavItems = [
    { title: "Explore", href: "/explore" },
    { title: "Blog", href: "/blog" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-background border-b-2 border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo_text.svg"
              alt="Money Talks"
              width={180}
              height={48}
              draggable={false}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NavItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-foreground text-base font-base px-4 py-2 border-2 border-transparent hover:border-border transition-all duration-150"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button variant="neutral" size="sm" asChild>
                  Log in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" asChild>
                  Start selling
                </Button>
              </SignUpButton>
            </Unauthenticated>
            <Authenticated>
              <div className="hidden md:flex items-center gap-1">
                <Button variant="neutral" size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>
              <UserButton />
            </Authenticated>
          </div>
        </div>
      </div>
    </nav>
  );
}
