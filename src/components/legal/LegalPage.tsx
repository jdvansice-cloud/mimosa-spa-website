import type { LegalDoc } from '@/content/legal'

// Shared server-rendered layout for privacy / terms / cancellation pages.
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="min-h-screen bg-cream">
      <section className="py-16 bg-beige text-center">
        <div className="container-spa">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-600 mb-4">
            Mimosa Spa Retreat
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-dark text-balance">{doc.title}</h1>
          <span className="block h-[2px] w-12 bg-gold mt-5 mx-auto" aria-hidden />
          <p className="text-warm-gray mt-5 text-sm">{doc.updated}</p>
        </div>
      </section>
      <section className="section">
        <div className="container-spa max-w-3xl">
          <p className="text-dark/80 leading-relaxed mb-8">{doc.intro}</p>
          {doc.sections.map((s) => (
            <div key={s.heading} className="mb-8">
              <h2 className="text-xl font-display font-semibold text-dark mb-3">
                {s.heading}
              </h2>
              <ul className="space-y-2">
                {s.body.map((p, i) => (
                  <li key={i} className="text-dark/70 leading-relaxed">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
