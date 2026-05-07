import { Metadata } from 'next';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import SectionTag from '@/components/gi2e/ui/SectionTag';
import { Trash2, Factory, HardHat, CheckCircle2, ChevronDown } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: 'Nos Solutions — GI2E',
  description: "Découvrez les solutions GI2E pour la gestion des déchets : collectivités, entreprises et BTP.",
};

const solutions = [
  {
    id: 'collectivites',
    icon: Trash2,
    title: 'Salubrité des collectivités',
    subtitle: 'Un environnement urbain propre pour tous',
    description: "GI2E s'engage aux côtés des collectivités locales pour assurer un cadre de vie propre et sain. De la collecte régulière des ordures ménagères au nettoyage des espaces publics, nos équipes interviennent avec rigueur et professionnalisme.",
    features: [
      'Collecte des ordures ménagères',
      'Nettoiement des voiries et espaces publics',
      'Transport vers les sites de traitement',
      'Désherbage et entretien des jardins',
      'Sensibilisation des populations',
      'Gestion des dépôts sauvages',
    ],
    image: '/assets/images/site/7-1024x768.jpg',
    color: 'bg-[#f0fdf4]',
    accent: '#22a05a',
  },
  {
    id: 'entreprises',
    icon: Factory,
    title: 'Salubrité des entreprises',
    subtitle: 'Des solutions sur mesure pour l\'industrie',
    description: "Les entreprises font face à des défis spécifiques en matière de gestion des déchets. GI2E propose des contrats de service adaptés à chaque secteur d'activité, garantissant la conformité environnementale et la sécurité des sites.",
    features: [
      'Collecte et tri des déchets industriels',
      'Gestion des déchets organiques',
      'Recyclage et valorisation',
      'Nettoyage des sites industriels',
      'Audit et conseil environnemental',
      'Élimination sécurisée des déchets dangereux',
    ],
    image: '/assets/images/site/10.jpeg',
    color: 'bg-[#fef9e7]',
    accent: '#d4a017',
  },
  {
    id: 'btp',
    icon: HardHat,
    title: 'Bâtiment & Travaux Publics',
    subtitle: 'Des chantiers propres et conformes',
    description: "Le secteur BTP génère d'importants volumes de déchets de chantier. GI2E assure l'évacuation régulière des gravats, matériaux de démolition et déchets divers, permettant à vos équipes de travailler dans un environnement sécurisé.",
    features: [
      'Évacuation des gravats et matériaux',
      'Gestion des déchets de démolition',
      'Nettoyage de chantier en fin de travaux',
      'Location de bennes',
      'Assainissement des zones de travaux',
      'Conformité aux normes environnementales',
    ],
    image: '/assets/images/site/6-1024x768.jpg',
    color: 'bg-neutral-50',
    accent: '#525252',
  },
];

const faq = [
  {
    q: "Comment demander un devis pour mes besoins en gestion des déchets ?",
    a: "Contactez-nous via notre formulaire en ligne ou appelez directement au 01 73 08 67 10. Un conseiller GI2E vous répondra sous 24h pour évaluer vos besoins et vous proposer une solution adaptée.",
  },
  {
    q: "GI2E intervient-il dans toute la Côte d'Ivoire ?",
    a: "GI2E opère actuellement dans 7 villes dont Abidjan, Bouaké, San-Pédro, Yamoussoukro, Daloa et Korhogo en Côte d'Ivoire, ainsi qu'à Kpalimé au Togo. Nous continuons d'étendre notre présence.",
  },
  {
    q: "Proposez-vous des contrats annuels pour les entreprises ?",
    a: "Oui, GI2E propose des contrats annuels avec des fréquences de collecte personnalisées selon vos volumes de déchets. Ces contrats incluent un suivi dédié et des rapports périodiques.",
  },
  {
    q: "Comment GI2E contribue-t-il au recyclage des déchets ?",
    a: "GI2E trie et oriente les déchets vers les filières de valorisation appropriées : compostage pour les organiques, recyclage pour les plastiques et métaux, centres de traitement agréés pour les déchets spéciaux.",
  },
];

export default function SolutionsPage() {
  return (
    <div className={playfair.variable}>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#052e16] overflow-hidden">
        <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 text-center">
          <SectionTag light className="mb-5 justify-center">Nos services</SectionTag>
          <h1
            className="gi2e-h1 text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Des solutions complètes<br />
            <span className="text-[#4ade80]">pour chaque secteur</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Collectivités, entreprises ou acteurs du BTP — GI2E propose une gamme
            complète de services adaptés à vos réalités et exigences.
          </p>
        </div>
      </section>

      {/* Solutions */}
      {solutions.map((svc, i) => {
        const Icon = svc.icon;
        const isEven = i % 2 === 0;
        return (
          <section key={svc.id} id={svc.id} className={`py-24 ${svc.color}`}>
            <div className="max-w-[1200px] mx-auto px-6 md:px-10">
              <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isEven ? '' : 'lg:[&>*:first-child]:order-2'}`}>
                {/* Text */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-neutral-600 mb-6 shadow-sm">
                    <Icon className="h-4 w-4" style={{ color: svc.accent }} />
                    Service GI2E
                  </div>
                  <h2
                    className="gi2e-h2 text-[#052e16] mb-3"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {svc.title}
                  </h2>
                  <p className="text-[#22a05a] font-medium mb-5">{svc.subtitle}</p>
                  <p className="text-neutral-600 leading-relaxed mb-8">{svc.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: svc.accent }} />
                        <span className="text-sm text-neutral-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Image */}
                <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* FAQ */}
      <section className="py-24 bg-white" id="documentation">
        <div className="max-w-[800px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <SectionTag className="mb-4 justify-center">FAQ</SectionTag>
            <h2
              className="gi2e-h2 text-[#052e16]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Questions fréquentes
            </h2>
          </div>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <details key={i} className="group bg-[#fafafa] rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-[#052e16]">
                  {item.q}
                  <ChevronDown className="h-5 w-5 text-neutral-400 group-open:rotate-180 transition-transform shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-neutral-600 text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
