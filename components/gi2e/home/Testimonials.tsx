'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import SectionTag from '@/components/gi2e/ui/SectionTag';

const testimonials = [
  {
    text: "GI2E a transformé la propreté de notre commune. Service fiable, réactif et des équipes véritablement professionnelles. Nous constatons une nette amélioration du cadre de vie de nos habitants.",
    author: "M. Koné Adama",
    role: "Maire de commune, Côte d'Ivoire",
    initials: "KA",
    color: "bg-[#22a05a]",
  },
  {
    text: "Un partenaire de confiance pour notre gestion des déchets industriels depuis 4 ans. GI2E répond toujours présent avec sérieux et ponctualité. Je recommande vivement leurs services.",
    author: "Mme Touré Fatoumata",
    role: "Directrice HSE, Groupe Industriel — Abidjan",
    initials: "TF",
    color: "bg-[#145e38]",
  },
  {
    text: "La campagne de sensibilisation menée par GI2E dans nos écoles a profondément changé le comportement des élèves vis-à-vis de la propreté. Un travail remarquable et durable.",
    author: "M. Bamba Seydou",
    role: "Directeur d'école — Bouaké",
    initials: "BS",
    color: "bg-[#d4a017]",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionTag className="mb-4 justify-center">Témoignages</SectionTag>
          <h2
            className="gi2e-h2 text-[#052e16]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Ce que disent nos partenaires
          </h2>
        </div>

        {/* Slider */}
        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#fafafa] rounded-3xl p-8 md:p-12 relative overflow-hidden"
              >
                {/* Big quote mark */}
                <Quote
                  className="absolute top-6 right-8 h-20 w-20 text-[#052e16]/5 rotate-180"
                  aria-hidden
                />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#e8b922] text-[#e8b922]" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-neutral-700 text-lg leading-relaxed mb-8 relative z-10">
                  &ldquo;{testimonials[active].text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-full ${testimonials[active].color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                  >
                    {testimonials[active].initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[#052e16]">{testimonials[active].author}</p>
                    <p className="text-sm text-neutral-500">{testimonials[active].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 hover:border-[#22a05a] hover:text-[#22a05a] transition-all duration-200"
              aria-label="Précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === active ? 'w-6 h-2.5 bg-[#22a05a]' : 'w-2.5 h-2.5 bg-neutral-200 hover:bg-neutral-300'
                  }`}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 hover:border-[#22a05a] hover:text-[#22a05a] transition-all duration-200"
              aria-label="Suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
