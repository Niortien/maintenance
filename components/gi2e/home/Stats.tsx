'use client';

import AnimCounter from '@/components/gi2e/ui/AnimCounter';

const stats = [
  {
    value: 2500,
    suffix: '+',
    label: 'Emplois directs et indirects',
    description: 'Créés depuis 2013',
  },
  {
    value: 150000,
    suffix: '+',
    label: 'Tonnes de déchets collectés',
    description: 'Volume annuel traité',
  },
  {
    value: 800,
    suffix: '+',
    label: 'Conteneurs déployés',
    description: 'Dans les zones desservies',
  },
  {
    value: 7,
    suffix: '',
    label: 'Villes desservies',
    description: 'Côte d\'Ivoire et Togo',
  },
];

export default function Stats() {
  return (
    <section className="bg-white py-16 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-neutral-100">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="px-6 md:px-8 py-6 first:pl-0 last:pr-0 text-center lg:text-left"
            >
              <p
                className="text-4xl md:text-5xl font-bold text-[#052e16] mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <AnimCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm font-semibold text-[#145e38] uppercase tracking-wide mb-1">
                {stat.label}
              </p>
              <p className="text-xs text-neutral-500">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
