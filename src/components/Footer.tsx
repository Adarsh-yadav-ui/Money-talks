import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Platform: [
    { title: "Explore", href: "/explore" },
    { title: "Pricing", href: "/pricing" },
    { title: "Blog", href: "/blog" },
    { title: "FAQ", href: "/faq" },
  ],
  Company: [
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Terms", href: "/terms" },
    { title: "Privacy", href: "/privacy" },
  ],
  Community: [
    { title: "Twitter", href: "#" },
    { title: "Discord", href: "#" },
    { title: "Instagram", href: "#" },
    { title: "YouTube", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground border-t-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo_text.svg"
                alt="Money Talks"
                width={160}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-background/70 font-base text-sm max-w-xs leading-relaxed">
              The digital products marketplace built for creators. Sell smarter,
              earn faster.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-heading text-background mb-4">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-background/60 font-base text-sm hover:text-background transition-colors duration-150"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t-2 border-background/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-background/50 font-base">
          <p>&copy; {new Date().getFullYear()} Money Talks. All rights reserved.</p>
          <p>Built for creators, by creators.</p>
        </div>
      </div>
    </footer>
  );
}
