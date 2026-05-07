'use client';

import Image from 'next/image';
import SectionTag from '@/components/gi2e/ui/SectionTag';

const partners = [
  { name: 'WMC', short: 'Waste Management Corp', bg: 'bg-white', text: 'text-orange-700', logo: '/assets/images/site/logo_wmc_orange_small-Copie.png' },
  { name: 'ONAD', short: "Office National de l\u2019Assainissement et du Drainage", bg: 'bg-blue-50', text: 'text-blue-700', logo: null },
  { name: 'ANASUR', short: 'Agence Nationale de Salubrité Urbaine', bg: 'bg-[#f0fdf4]', text: 'text-[#145e38]', logo: null },
  { name: 'Bolloré', short: 'Bolloré Africa Logistics', bg: 'bg-neutral-50', text: 'text-neutral-700', logo: null },
  { name: 'CICG', short: "Centre d\u2019Information Civique de Guinée", bg: 'bg-purple-50', text: 'text-purple-700', logo: null },
  { name: "Mairie d\u2019Abidjan", short: "District d\u2019Abidjan", bg: 'bg-[#fef9e7]', text: 'text-amber-700', logo: null },
  { name: 'BNETD', short: "Bureau National d\u2019Études Techniques et de Développement", bg: 'bg-red-50', text: 'text-red-700', logo: null },
  { name: 'MINEDD', short: "Ministère de l\u2019Environnement", bg: 'bg-[#f0fdf4]', text: 'text-[#22a05a]', logo: '/assets/images/site/logo_wmc_black_small.png' },
];

// Duplicate for seamless marquee
const doubled = [...partners, ...partners];

export default function Partners() {
  return (
    <section className="py-16 bg-[#f5f5f5] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 mb-10">
        <div className="text-center">
          <SectionTag className="mb-3 justify-center">Partenaires & Références</SectionTag>
          <p className="text-sm text-neutral-500">Ils nous font confiance pour un environnement plus sain</p>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="flex overflow-hidden">
          <div className="gi2e-marquee-track flex gap-4 shrink-0">
            {doubled.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className={`flex flex-col items-center justify-center px-8 py-5 rounded-xl ${p.bg} min-w-40 shrink-0`}
              >
                {p.logo ? (
                  <div className="relative h-10 w-28 mb-1">
                    <Image src={p.logo} alt={p.name} fill className="object-contain" />
                  </div>
                ) : (
                  <span className={`text-lg font-bold ${p.text}`}>{p.name}</span>
                )}
                <span className="text-[10px] text-neutral-500 text-center mt-1 max-w-[120px] leading-tight line-clamp-2">
                  {p.short}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-[#f5f5f5] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-[#f5f5f5] to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
