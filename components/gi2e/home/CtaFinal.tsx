'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

export default function CtaFinal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #0d3d22 0%, #1a7a4a 100%)' }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
            Passons à l&apos;action ensemble
          </div>

          {/* Heading */}
          <h2
            className="gi2e-h2 text-white mb-6 max-w-3xl mx-auto"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Travaillons ensemble pour un<br />
            <span className="text-[#4ade80]">environnement plus sain</span>
          </h2>

          {/* Subtitle */}
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
            Collectivités, entreprises ou acteurs du BTP — GI2E a la solution
            adaptée à vos besoins en gestion des déchets.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#052e16] font-bold text-sm shadow-xl hover:bg-[#f0fdf4] transition-all duration-200 group"
            >
              <Phone className="h-4 w-4" />
              Nous contacter
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
            >
              Découvrir nos services
            </Link>
          </div>

          {/* Contact info */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm">
            <a href="mailto:info@gi2e-ci.com" className="hover:text-white transition-colors">
              info@gi2e-ci.com
            </a>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <a href="tel:+2250173086710" className="hover:text-white transition-colors">
              01 73 08 67 10
            </a>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>13 BP 2992 Abidjan 13</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
