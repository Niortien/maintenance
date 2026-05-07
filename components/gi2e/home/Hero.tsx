'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

const stats = [
  { value: '2 500+', label: 'Emplois créés' },
  { value: '150 000+', label: 'Tonnes collectées' },
  { value: '800+', label: 'Conteneurs déployés' },
  { value: '7', label: 'Villes desservies' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut' as const, delay },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#0d3d22]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/images/site/4.jpg"
          alt="Flotte GI2E et équipes sur le terrain"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 gi2e-hero-overlay" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative flex-1 flex items-center">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 w-full py-32 md:py-0">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-center">

            {/* Left — Text */}
            <div>
              {/* Badge */}
              <motion.div {...fadeUp(0.1)}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-medium mb-8">
                  <span className="h-2 w-2 rounded-full bg-[#4ade80] animate-pulse" />
                  Fondé en 2013 · Abidjan, Côte d&apos;Ivoire
                </div>
              </motion.div>

              {/* H1 */}
              <motion.h1
                {...fadeUp(0.25)}
                className="gi2e-h1 text-white mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                L&apos;environnement{' '}
                <span className="text-[#4ade80]">sain</span>,<br />
                notre business
              </motion.h1>

              {/* Subtitle */}
              <motion.p {...fadeUp(0.4)} className="text-white/70 text-lg leading-relaxed max-w-xl mb-10">
                Depuis 2013, GI2E accompagne collectivités, entreprises et acteurs du BTP
                dans la gestion durable des déchets et l&apos;assainissement urbain
                en Côte d&apos;Ivoire et au Togo.
              </motion.p>

              {/* Buttons */}
              <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-4">
                <Link
                  href="/solutions"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#22a05a] text-white font-semibold shadow-lg shadow-green-900/30 hover:bg-[#1a7a4a] transition-all duration-200 group"
                >
                  Découvrir nos services
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/nous-connaitre"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                >
                  Nous connaître
                </Link>
              </motion.div>

              {/* Mini stats row */}
              <motion.div
                {...fadeUp(0.65)}
                className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p
                      className="text-2xl font-bold text-[#4ade80]"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {s.value}
                    </p>
                    <p className="text-xs text-white/60 mt-0.5 leading-tight">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main image */}
                <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                  <Image
                    src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80"
                    alt="Équipe GI2E collecte des déchets"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 400px, 500px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 min-w-[180px]">
                  <p className="text-xs font-semibold text-[#22a05a] uppercase tracking-wider mb-1">
                    Impact
                  </p>
                  <p
                    className="text-3xl font-bold text-[#052e16]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    7
                  </p>
                  <p className="text-sm text-neutral-600">villes desservies</p>
                </div>
                {/* Decorative circle */}
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full border-2 border-[#4ade80]/30" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative pb-10 flex justify-center">
        <div className="gi2e-scroll-bounce flex flex-col items-center gap-2">
          <ChevronDown className="h-5 w-5 text-white/50" />
        </div>
      </div>
    </section>
  );
}
