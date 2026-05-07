'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SectionTag from '@/components/gi2e/ui/SectionTag';

const values = ['Engagement', 'Durabilité', 'Innovation', 'Responsabilité', 'Excellence'];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });

  return (
    <section className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            {/* Decorative border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-[#22a05a]/20 z-0" />

            {/* Main image */}
            <div className="relative h-[420px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl z-10">
              <Image
                src="/assets/images/site/9.jpg"
                alt="Grande équipe GI2E en gilets réfléchissants"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#052e16]/40 to-transparent" />
            </div>

            {/* Floating quote card */}
            <div className="absolute -bottom-6 left-6 right-6 md:left-8 md:right-auto md:w-72 bg-white rounded-2xl shadow-xl p-5 z-20">
              <div className="flex items-start gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-[#22a05a] to-[#052e16] flex items-center justify-center text-white font-bold text-sm">
                    SY
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 italic leading-relaxed">
                    &ldquo;Notre mission : un environnement sain pour tous.&rdquo;
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-[#052e16]">Dr. SOUMAHORO Youssouf</p>
                  <p className="text-[10px] text-neutral-500">Directeur Général, GI2E</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Text */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <SectionTag className="mb-5">Notre histoire</SectionTag>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="gi2e-h2 text-[#052e16] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Pionniers de la gestion<br />
              <span className="text-[#22a05a]">durable des déchets</span><br />
              en Côte d&apos;Ivoire
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            >
              <div className="w-12 h-0.5 bg-[#22a05a] mb-6" />
              <p className="text-neutral-600 text-base leading-relaxed mb-4">
                Fondé en 2013 à Abidjan, le Groupement Ivoire Eco Environnement (GI2E) s&apos;est
                imposé comme un acteur majeur de l&apos;assainissement urbain en Côte d&apos;Ivoire
                et au Togo. Notre approche intégrée combine expertise terrain, technologies adaptées
                et engagement communautaire.
              </p>
              <p className="text-neutral-600 text-base leading-relaxed mb-8">
                Avec plus de 2 500 emplois créés et 150 000 tonnes de déchets collectés,
                nous contribuons chaque jour à un cadre de vie meilleur pour les populations
                des villes que nous desservons.
              </p>
            </motion.div>

            {/* Values pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {values.map((v, i) => (
                <span
                  key={v}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-[#dcfce7] bg-[#f0fdf4] text-[#145e38]"
                  style={{ transitionDelay: `${i * 0.05}s` }}
                >
                  {v}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            >
              <Link
                href="/nous-connaitre"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#22a05a] hover:text-[#145e38] transition-colors group"
              >
                Découvrir notre histoire
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
