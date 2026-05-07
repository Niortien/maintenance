import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import SectionTag from '@/components/gi2e/ui/SectionTag';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: 'Actualités — GI2E',
  description: "Les dernières actualités de GI2E : projets, campagnes de sensibilisation et expansion.",
};

const articles = [
  {
    slug: 'programme-gestion-dechets-chantier',
    category: 'BTP',
    categoryColor: 'bg-[#fef9e7] text-[#92400e]',
    title: "Mise en place d'un programme de gestion des déchets de chantier",
    date: '15 Avril 2025',
    excerpt: "GI2E lance un programme innovant de gestion des déchets de chantier à Abidjan, visant à réduire l'impact environnemental des projets de construction.",
    image: '/assets/images/site/6-1024x768.jpg',
  },
  {
    slug: 'campagne-sensibilisation-plastiques',
    category: 'Environnement',
    categoryColor: 'bg-[#f0fdf4] text-[#145e38]',
    title: "Campagne de sensibilisation sur les déchets plastiques",
    date: '8 Mars 2025',
    excerpt: "GI2E mène une grande campagne de sensibilisation dans 5 communes d'Abidjan pour lutter contre la pollution plastique.",
    image: '/assets/images/site/3-1024x683.jpg',
  },
  {
    slug: 'sensibilisation-dechets-scolaires',
    category: 'Éducation',
    categoryColor: 'bg-[#eff6ff] text-[#1d4ed8]',
    title: "Sensibilisation à la gestion des déchets en milieu scolaire",
    date: '20 Février 2025',
    excerpt: "Des ateliers de sensibilisation environnementale ont été organisés dans 30 écoles primaires de Bouaké.",
    image: '/assets/images/site/17-1024x683.jpg',
  },
  {
    slug: 'expansion-transport-nouvelles-villes',
    category: 'Expansion',
    categoryColor: 'bg-[#f0fdf4] text-[#145e38]',
    title: "Expansion des services de transport vers de nouvelles villes",
    date: '5 Janvier 2025',
    excerpt: "GI2E étend ses services de transport et de collecte vers deux nouvelles villes de Côte d'Ivoire.",
    image: '/assets/images/site/4.jpg',
  },
  {
    slug: 'bilan-annuel-2024',
    category: 'Rapport',
    categoryColor: 'bg-neutral-100 text-neutral-700',
    title: "Bilan annuel 2024 : une année de croissance et d'impact",
    date: '20 Décembre 2024',
    excerpt: "GI2E publie son bilan annuel 2024, marqué par une hausse de 15% des volumes collectés et l'ouverture de 3 nouvelles zones.",
    image: '/assets/images/site/11-1024x768.jpg',
  },
  {
    slug: 'partenariat-mairie-abidjan',
    category: 'Partenariat',
    categoryColor: 'bg-purple-50 text-purple-700',
    title: "Renouvellement du partenariat avec la mairie d'Abidjan",
    date: '10 Novembre 2024',
    excerpt: "GI2E et la mairie d'Abidjan renouvellent leur contrat de salubrité urbaine pour une durée de 3 ans.",
    image: '/assets/images/site/13.jpg',
  },
];

export default function ActualitesPage() {
  return (
    <div className={playfair.variable}>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#fafafa] border-b border-neutral-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <SectionTag className="mb-4">Actualités</SectionTag>
          <h1
            className="gi2e-h1 text-[#052e16] max-w-2xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Toutes nos <span className="text-[#22a05a]">actualités</span>
          </h1>
          <p className="text-neutral-600 text-lg mt-4 max-w-xl">
            Suivez l&apos;actualité de GI2E : projets, partenariats, campagnes
            et rapports d&apos;activité.
          </p>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/actualites/${article.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                {/* Content */}
                <div className="p-5">
                  <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full mb-3 ${article.categoryColor}`}>
                    <Tag className="inline h-2.5 w-2.5 mr-1" />
                    {article.category}
                  </span>
                  <h3
                    className="font-bold text-[#052e16] mb-2 group-hover:text-[#22a05a] transition-colors leading-snug"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {article.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {article.date}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#22a05a] group-hover:text-[#145e38]">
                      Lire la suite <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
