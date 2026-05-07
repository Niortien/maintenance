'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Trash2, Factory, HardHat, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SectionTag from '@/components/gi2e/ui/SectionTag';

const services = [
  {
    num: '01',
    icon: Trash2,
    title: 'Salubrité des collectivités',
    tags: ['Collecte', 'Nettoiement', 'Transport', 'Désherbage'],
    description:
      'GI2E accompagne les collectivités locales dans la gestion intégrale de leurs déchets urbains, du ramassage au transport, en passant par le nettoiement et l\u2019entretien des espaces publics.',
    image: '/assets/images/site/7-1024x768.jpg',
    href: '/solutions#collectivites',
    color: 'bg-[#f0fdf4]',
    iconBg: 'bg-[#dcfce7]',
    iconColor: 'text-[#145e38]',
  },
  {
    num: '02',
    icon: Factory,
    title: 'Salubrité des entreprises',
    tags: ['Déchets industriels', 'Organiques', 'Recyclables'],
    description:
      'Nous proposons des solutions adaptées aux entreprises pour la collecte, le tri et l\u2019élimination sécurisée de tous types de déchets industriels, organiques et recyclables.',
    image: '/assets/images/site/1.jpg',
    href: '/solutions#entreprises',
    color: 'bg-[#fef9e7]',
    iconBg: 'bg-[#fde68a]',
    iconColor: 'text-[#92400e]',
  },
  {
    num: '03',
    icon: HardHat,
    title: 'Bâtiment & Travaux Publics',
    tags: ['Chantiers', 'Infrastructures', 'Gravats'],
    description:
      'Pour les acteurs du BTP, GI2E assure l\u2019évacuation des gravats, l\u2019assainissement des chantiers et la gestion des déchets de construction dans le respect des normes environnementales.',
    image: '/assets/images/site/6-1024x768.jpg',
    href: '/solutions#btp',
    color: 'bg-neutral-50',
    iconBg: 'bg-neutral-100',
    iconColor: 'text-neutral-700',
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <section className="py-24 md:py-32 bg-[#fafafa]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <SectionTag className="mb-4">Nos services</SectionTag>
            <h2
              className="gi2e-h2 text-[#052e16]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Des solutions pour chaque<br />
              <span className="text-[#22a05a]">acteur de l&apos;environnement</span>
            </h2>
          </div>
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#22a05a] hover:text-[#145e38] transition-colors group shrink-0"
          >
            Voir tous les services
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.num}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
                className={`relative ${svc.color} rounded-2xl p-8 overflow-hidden gi2e-card-hover cursor-pointer`}
              >
                {/* Card image */}
                <div className="relative h-44 -mx-8 -mt-8 mb-7 rounded-t-2xl overflow-hidden">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/30" />
                </div>

                {/* Decorative number */}
                <span
                  className="absolute top-48 right-6 text-7xl font-bold text-[#052e16]/5 select-none pointer-events-none"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  aria-hidden
                >
                  {svc.num}
                </span>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${svc.iconBg} mb-6`}>
                  <Icon className={`h-6 w-6 ${svc.iconColor}`} />
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold text-[#052e16] mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {svc.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {svc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/70 text-[#145e38] border border-[#dcfce7]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-600 leading-relaxed mb-5">
                  {svc.description}
                </p>

                {/* Link */}
                <Link
                  href={svc.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#22a05a] hover:text-[#145e38] transition-colors group"
                >
                  En savoir plus
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
