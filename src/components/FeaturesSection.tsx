import { FileText, Zap, Globe, Shield, Wallet, Headphones } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Digital files, delivered",
    description:
      "Sell any digital file — PDFs, templates, presets, software, audio. We handle the delivery instantly after purchase.",
  },
  {
    icon: Zap,
    title: "Lightning fast setup",
    description:
      "Create your storefront in minutes. No coding, no design skills needed. Just upload and start selling.",
  },
  {
    icon: Globe,
    title: "Global marketplace",
    description:
      "Reach buyers worldwide. Our platform handles multi-currency pricing and automatic tax compliance.",
  },
  {
    icon: Shield,
    title: "Built-in protection",
    description:
      "Secure file hosting, fraud detection, and purchase protection for both creators and buyers.",
  },
  {
    icon: Wallet,
    title: "Fair pricing",
    description:
      "Just 5% per sale. No monthly fees, no hidden charges. You keep what you earn.",
  },
  {
    icon: Headphones,
    title: "Creator-first support",
    description:
      "Real humans, real fast. Our support team helps you grow your digital products business.",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-b-2 border-border bg-secondary-background py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block border-2 border-border bg-main px-4 py-1 text-sm font-base text-main-foreground mb-4">
            Why Money Talks
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading text-foreground">
            Everything you need to
            <span className="text-main"> sell digital</span>
          </h2>
          <p className="mt-4 text-lg text-foreground/70 font-base">
            No fluff, no complexity. Just the tools you need to turn your
            knowledge and creativity into income.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="border-2 border-border bg-background p-6 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-150"
              >
                <div className="size-12 border-2 border-border bg-main flex items-center justify-center mb-4">
                  <Icon className="size-6 text-main-foreground" />
                </div>
                <h3 className="text-xl font-heading text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 font-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
