import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/providers/ConvexProviderWithClerk";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Money Talks",
  description:
    "MoneyTalks is a full-stack digital products marketplace where creators can sell ebooks, templates, presets, and any digital file — and buyers can instantly access them after purchase.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", spaceGrotesk.variable, spaceGrotesk.className)}>
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
