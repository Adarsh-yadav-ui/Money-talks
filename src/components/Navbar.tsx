"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { CategoriesBar } from "@/components/CategoriesBar";

export function Navbar() {
  const currentUser = useQuery(api.users.current);
  const cartCount = useQuery(api.cart.getCartCount);
  const [open, setOpen] = useState(false);

  const NavItems = [
    { title: "Explore", href: "/explore" },
    { title: "Blog", href: "/blog" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-background sticky top-0 z-50">
      <div className="border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="neutral" size="icon" className="shrink-0">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 border-r-2 border-border">
                <div className="flex flex-col h-full bg-secondary-background">
                  <div className="flex items-center justify-between p-4 border-b-2 border-border bg-background">
                    <span className="font-heading text-lg">Menu</span>
                    <SheetClose asChild>
                      <Button variant="neutral" size="icon">
                        <X className="size-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  <div className="flex-1 flex flex-col p-4 gap-1">
                    {NavItems.map((item) => (
                      <SheetClose asChild key={item.title}>
                        <Link
                          href={item.href}
                          className="text-foreground text-base font-base px-4 py-3 border-2 border-transparent hover:border-border hover:bg-main/10 transition-all duration-150"
                        >
                          {item.title}
                        </Link>
                      </SheetClose>
                    ))}
                    <div className="border-t-2 border-border my-2" />
                    <Authenticated>
                      <SheetClose asChild>
                        <Link
                          href="/purchases"
                          className="text-foreground text-base font-base px-4 py-3 border-2 border-transparent hover:border-border hover:bg-main/10 transition-all duration-150"
                        >
                          Purchases
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className="text-foreground text-base font-base px-4 py-3 border-2 border-transparent hover:border-border hover:bg-main/10 transition-all duration-150"
                        >
                          Dashboard
                        </Link>
                      </SheetClose>
                    </Authenticated>
                      <div className="border-t-2 border-border my-2" />
                      <Unauthenticated>
                        <SheetClose asChild>
                          <SignInButton mode="modal">
                            <Button variant="neutral" className="w-full justify-start">
                              Log in
                            </Button>
                          </SignInButton>
                        </SheetClose>
                        <SheetClose asChild>
                          <SignUpButton mode="modal">
                            <Button className="w-full justify-start">
                              Start selling
                            </Button>
                          </SignUpButton>
                        </SheetClose>
                      </Unauthenticated>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/" className="shrink-0">
                <Image
                  src="/logo_text.svg"
                  alt="Money Talks"
                  width={160}
                  height={42}
                  draggable={false}
                  priority
                />
              </Link>
            </div>

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

            <div className="flex items-center gap-2">
              <Authenticated>
                <Link
                  href="/cart"
                  className="relative p-2 border-2 border-transparent hover:border-border transition-all duration-150"
                >
                  <ShoppingCart className="size-5" />
                  {(cartCount ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-main text-main-foreground text-xs font-heading w-5 h-5 flex items-center justify-center border-2 border-border">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Authenticated>
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
                  <Button className="mr-4" variant="neutral" size="sm" asChild>
                    <Link href="/purchases">Purchases</Link>
                  </Button>
                  <Button variant="neutral" size="sm" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </div>
                <UserButton />
              </Authenticated>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <CategoriesBar />
      </Suspense>
    </nav>
  );
}
