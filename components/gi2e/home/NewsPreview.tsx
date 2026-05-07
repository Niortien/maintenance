'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import SectionTag from '@/components/gi2e/ui/SectionTag';

const articles = [
  {
    slug: 'programme-gestion-dechets-chantier',
    category: 'BTP',
    categoryColor: 'bg-[#fef9e7] text-[#92400e] border-[#fde68a]',
    title: "Mise en place d'un programme de gestion des déchets de chantier",
    date: '15 Avril 2025',
    image: '/assets/images/site/17-1024x683.jpg',
    featured: true,
  },
  {
    slug: 'campagne-sensibilisation-plastiques',
    category: 'Environnement',
    categoryColor: 'bg-[#f0fdf4] text-[#145e38] border-[#dcfce7]',
    title: "Campagne de sensibilisation sur les déchets plastiques",
    date: '8 Mars 2025',
    image: '/assets/images/site/3-1024x683.jpg',
    featured: false,
  },
  {
    slug: 'sensibilisation-dechets-scolaires',
    category: 'Éducation',
    categoryColor: 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]',
    title: "Sensibilisation à la gestion des déchets en milieu scolaire",
    date: '20 Février 2025',
    image: '/assets/images/site/11-1024x768.jpg',
    featured: false,
  },
  {
    slug: 'expansion-transport-nouvelles-villes',
    category: 'Expansion',
    categoryColor: 'bg-[#f0fdf4] text-[#145e38] border-[#dcfce7]',
    title: "Expansion des services de transport vers de nouvelles villes",
    date: '5 Janvier 2025',
    image: '/assets/images/site/10.jpeg',
    featured: false,
  },
];

export default function NewsPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  const featured = articles.find((a) => a.featured)!;
  const rest = articles.filter((a) => !a.featured);

  return (
    <section className="py-24 md:py-32 bg-[#fafafa]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionTag className="mb-4">Actualités</SectionTag>
            <h2
              className="gi2e-h2 text-[#052e16]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Dernières nouvelles
            </h2>
          </div>
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#22a05a] hover:text-[#145e38] transition-colors group shrink-0"
          >
            Toutes les actualités
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-6">
          {/* Featured */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={`/actualites/${featured.slug}`} className="group block h-full">
              <div className="relative overflow-hidden rounded-2xl h-full min-h-80 bg-neutral-200">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#052e16]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border mb-3 ${featured.categoryColor}`}
                  >
                    {featured.category}
                  </span>
                  <h3
                    className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#4ade80] transition-colors"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {featured.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Calendar className="h-3.5 w-3.5" />
                    {featured.date}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Small cards */}
          <div className="flex flex-col gap-4">
            {rest.map((article, i) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.1 }}
              >
                <Link href={`/actualites/${article.slug}`} className="group flex gap-4 bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full border mb-1.5 ${article.categoryColor}`}
                    >
                      {article.category}
                    </span>
                    <h4
                      className="text-sm font-semibold text-[#052e16] leading-tight mb-1.5 group-hover:text-[#22a05a] transition-colors line-clamp-2"
                    >
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
