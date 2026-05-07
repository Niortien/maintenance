'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionTag from '@/components/gi2e/ui/SectionTag';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const cities = [
  { name: 'Abidjan', country: 'CI', x: 22, y: 68, featured: true, service: 'Collecte, Nettoiement, Transport' },
  { name: 'Bouaké', country: 'CI', x: 45, y: 42, featured: false, service: 'Collecte, Sensibilisation' },
  { name: 'San-Pédro', country: 'CI', x: 28, y: 76, featured: false, service: 'Collecte, Transport' },
  { name: 'Yamoussoukro', country: 'CI', x: 38, y: 50, featured: false, service: 'Salubrité urbaine' },
  { name: 'Daloa', country: 'CI', x: 30, y: 50, featured: false, service: 'Collecte' },
  { name: 'Korhogo', country: 'CI', x: 44, y: 22, featured: false, service: 'Collecte' },
  { name: 'Kpalimé', country: 'TG', x: 80, y: 55, featured: false, service: 'Gestion déchets' },
];

export default function ZoneMap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <section className="py-24 md:py-32 bg-[#0d3d22]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Map visualization */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative rounded-2xl overflow-hidden bg-[#052e16] border border-[#145e38]/50 aspect-4/3">
              {/* Map background */}
              <div className="absolute inset-0 p-8">
                {/* Simplified Côte d'Ivoire SVG shape */}
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
                  <path
                    d="M 10 20 L 15 15 L 25 12 L 40 10 L 55 12 L 65 18 L 70 25 L 68 35 L 72 45 L 70 55 L 65 65 L 55 75 L 45 80 L 35 82 L 25 78 L 15 72 L 8 62 L 6 50 L 8 38 L 10 28 Z"
                    fill="none"
                    stroke="#22a05a"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* City points */}
                {cities.map((city) => (
                  <div
                    key={city.name}
                    className="absolute"
                    style={{ left: `${city.x}%`, top: `${city.y}%` }}
                  >
                    {/* Pulse ring */}
                    <div
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full gi2e-pulse-ring ${
                        city.featured
                          ? 'h-8 w-8 bg-[#4ade80]/20'
                          : city.country === 'TG'
                          ? 'h-6 w-6 bg-[#e8b922]/20'
                          : 'h-5 w-5 bg-[#22a05a]/20'
                      }`}
                    />
                    {/* Dot */}
                    <div
                      className={`relative -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white ${
                        city.featured
                          ? 'h-4 w-4 bg-[#4ade80]'
                          : city.country === 'TG'
                          ? 'h-3 w-3 bg-[#e8b922]'
                          : 'h-2.5 w-2.5 bg-[#22a05a]'
                      }`}
                      title={city.name}
                    />
                    {/* Label */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold ${
                          city.featured ? 'text-[#4ade80]' : city.country === 'TG' ? 'text-[#e8b922]' : 'text-white/70'
                        }`}
                      >
                        {city.name}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
                    <span className="text-[10px] text-white/60">Capitale</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#22a05a]" />
                    <span className="text-[10px] text-white/60">Côte d'Ivoire</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#e8b922]" />
                    <span className="text-[10px] text-white/60">Togo</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Text + cities list */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            >
              <SectionTag light className="mb-5">Zone d&apos;intervention</SectionTag>
              <h2
                className="gi2e-h2 text-white mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Présents dans<br />
                <span className="text-[#4ade80]">7 villes · 2 pays</span>
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-8">
                De Abidjan à Kpalimé, GI2E étend ses services dans les principales
                agglomérations d&apos;Afrique de l&apos;Ouest, apportant des solutions
                d&apos;assainissement adaptées à chaque contexte urbain depuis 2013.
              </p>
            </motion.div>

            {/* Cities chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {cities.map((city) => (
                <span
                  key={city.name}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                    city.featured
                      ? 'border-[#4ade80]/40 bg-[#4ade80]/10 text-[#4ade80]'
                      : city.country === 'TG'
                      ? 'border-[#e8b922]/40 bg-[#e8b922]/10 text-[#e8b922]'
                      : 'border-[#22a05a]/40 bg-[#22a05a]/10 text-[#22a05a]'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      city.featured ? 'bg-[#4ade80]' : city.country === 'TG' ? 'bg-[#e8b922]' : 'bg-[#22a05a]'
                    }`}
                  />
                  {city.name}
                  {city.country === 'TG' && (
                    <span className="text-[10px] opacity-70">· Togo</span>
                  )}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
            >
              <Link
                href="/zone-intervention"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#4ade80] hover:text-white transition-colors group"
              >
                Voir toutes nos zones
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
