import { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import SectionTag from '@/components/gi2e/ui/SectionTag';
import { MapPin, Users, Truck } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: "Zone d'intervention — GI2E",
  description: "GI2E intervient dans 7 villes en Côte d'Ivoire et au Togo.",
};

const cities = [
  {
    name: 'Abidjan',
    country: 'Côte d\'Ivoire',
    featured: true,
    services: ['Collecte ménagère', 'Nettoiement voirie', 'Transport déchets', 'Sensibilisation'],
    stats: { emplois: '1 200+', conteneurs: '350+', population: '6,3M' },
    description: "Capitale économique et siège social de GI2E, Abidjan est notre zone d'intervention principale depuis 2013.",
  },
  {
    name: 'Bouaké',
    country: 'Côte d\'Ivoire',
    featured: false,
    services: ['Collecte ménagère', 'Sensibilisation scolaire', 'Nettoiement'],
    stats: { emplois: '300+', conteneurs: '120+', population: '740K' },
    description: "Deuxième ville du pays, Bouaké bénéficie de nos services de collecte et de sensibilisation environnementale.",
  },
  {
    name: 'San-Pédro',
    country: 'Côte d\'Ivoire',
    featured: false,
    services: ['Collecte ménagère', 'Transport déchets'],
    stats: { emplois: '180+', conteneurs: '80+', population: '320K' },
    description: "Port industriel stratégique, San-Pédro est couvert par nos services depuis 2016.",
  },
  {
    name: 'Yamoussoukro',
    country: 'Côte d\'Ivoire',
    featured: false,
    services: ['Salubrité urbaine', 'Espaces publics'],
    stats: { emplois: '140+', conteneurs: '60+', population: '250K' },
    description: "Capitale politique de la Côte d'Ivoire, Yamoussoukro bénéficie de nos services de salubrité urbaine.",
  },
  {
    name: 'Daloa',
    country: 'Côte d\'Ivoire',
    featured: false,
    services: ['Collecte ménagère'],
    stats: { emplois: '90+', conteneurs: '50+', population: '260K' },
    description: "Centre économique de l'ouest ivoirien, Daloa fait partie de notre réseau de collecte.",
  },
  {
    name: 'Korhogo',
    country: 'Côte d\'Ivoire',
    featured: false,
    services: ['Collecte ménagère', 'Sensibilisation'],
    stats: { emplois: '80+', conteneurs: '45+', population: '290K' },
    description: "Capitale du nord, Korhogo est la ville la plus récemment intégrée à notre réseau.",
  },
  {
    name: 'Kpalimé',
    country: 'Togo',
    featured: false,
    services: ['Gestion déchets', 'Collecte'],
    stats: { emplois: '60+', conteneurs: '30+', population: '75K' },
    description: "Notre première implantation internationale au Togo, ouverte en 2019.",
  },
];

export default function ZoneInterventionPage() {
  return (
    <div className={playfair.variable}>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#0d3d22]">
        <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 text-center">
          <SectionTag light className="mb-5 justify-center">Zones d&apos;intervention</SectionTag>
          <h1
            className="gi2e-h1 text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Présents dans <span className="text-[#4ade80]">7 villes</span>,<br />
            2 pays d&apos;Afrique de l&apos;Ouest
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            GI2E étend progressivement son réseau pour apporter des solutions
            d&apos;assainissement à de nouvelles populations.
          </p>

          {/* Summary chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm">
              <MapPin className="h-4 w-4 text-[#4ade80]" />
              7 villes couvertes
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm">
              <Users className="h-4 w-4 text-[#4ade80]" />
              2 500+ emplois créés
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm">
              <Truck className="h-4 w-4 text-[#4ade80]" />
              800+ conteneurs
            </div>
          </div>
        </div>
      </section>

      {/* Cities grid */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <div
                key={city.name}
                className={`rounded-2xl p-6 border ${
                  city.featured
                    ? 'bg-[#f0fdf4] border-[#dcfce7]'
                    : city.country === 'Togo'
                    ? 'bg-[#fef9e7] border-[#fde68a]'
                    : 'bg-[#fafafa] border-neutral-100'
                } gi2e-card-hover`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          city.featured ? 'bg-[#4ade80]' : city.country === 'Togo' ? 'bg-[#e8b922]' : 'bg-[#22a05a]'
                        }`}
                      />
                      <h3
                        className="text-lg font-bold text-[#052e16]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {city.name}
                      </h3>
                      {city.featured && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#22a05a] text-white rounded-full">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {city.country}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed mb-4">{city.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-white/80 rounded-xl">
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#052e16]">{city.stats.emplois}</p>
                    <p className="text-[10px] text-neutral-500">emplois</p>
                  </div>
                  <div className="text-center border-x border-neutral-100">
                    <p className="text-sm font-bold text-[#052e16]">{city.stats.conteneurs}</p>
                    <p className="text-[10px] text-neutral-500">conteneurs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#052e16]">{city.stats.population}</p>
                    <p className="text-[10px] text-neutral-500">population</p>
                  </div>
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-1.5">
                  {city.services.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white border border-neutral-200 text-neutral-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
