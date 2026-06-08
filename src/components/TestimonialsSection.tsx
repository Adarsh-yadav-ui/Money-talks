const testimonials = [
  {
    quote:
      "I made $12k in my first month selling my Notion templates on Money Talks. The setup took me 10 minutes.",
    author: "Sophie Lambert",
    role: "Notion Creator",
  },
  {
    quote:
      "The 5% fee is unbeatable. I was paying 15-20% elsewhere. Money Talks actually cares about creators.",
    author: "David Okonkwo",
    role: "Digital Artist",
  },
  {
    quote:
      "My preset packs are flying off the shelf. The instant delivery and global reach is a game changer.",
    author: "Yuki Tanaka",
    role: "Photographer",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-b-2 border-border bg-secondary-background py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block border-2 border-border bg-main px-4 py-1 text-sm font-base text-main-foreground mb-4 shadow-shadow">
            Testimonials
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading text-foreground">
            Loved by creators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="border-2 border-border bg-background p-6 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-150 flex flex-col"
            >
              <svg className="size-8 text-main mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              <blockquote className="text-foreground/80 font-base leading-relaxed mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="border-t-2 border-border pt-4">
                <div className="font-heading text-foreground">{t.author}</div>
                <div className="text-sm text-foreground/60 font-base">
                  {t.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
