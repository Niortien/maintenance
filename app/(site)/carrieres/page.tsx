import { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import SectionTag from '@/components/gi2e/ui/SectionTag';
import { Briefcase, GraduationCap, Users, Upload, MapPin, Clock } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: 'Carrières — GI2E',
  description: "Rejoignez GI2E et contribuez à un avenir plus propre. Découvrez nos offres d'emploi.",
};

const metiers = [
  { icon: Briefcase, title: 'Opérations terrain', desc: 'Chauffeurs, agents de collecte, techniciens de nettoiement.' },
  { icon: GraduationCap, title: 'Ingénierie environnementale', desc: 'Ingénieurs HSE, consultants, chefs de projet.' },
  { icon: Users, title: 'Administration & Gestion', desc: 'Comptables, RH, chargés de clientèle, managers.' },
];

const offres = [
  {
    titre: 'Chauffeur poids lourd — Collecte déchets',
    type: 'CDI',
    lieu: 'Abidjan',
    categorie: 'Terrain',
  },
  {
    titre: 'Ingénieur HSE junior',
    type: 'CDI',
    lieu: 'Abidjan',
    categorie: 'Ingénierie',
  },
  {
    titre: 'Chargé(e) de clientèle — Services entreprises',
    type: 'CDI',
    lieu: 'Abidjan / Bouaké',
    categorie: 'Commercial',
  },
  {
    titre: 'Agent de nettoiement et salubrité',
    type: 'CDD',
    lieu: 'San-Pédro',
    categorie: 'Terrain',
  },
  {
    titre: 'Responsable de zone — Korhogo',
    type: 'CDI',
    lieu: 'Korhogo',
    categorie: 'Management',
  },
];

export default function CarrieresPage() {
  return (
    <div className={playfair.variable}>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#052e16]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 text-center">
          <SectionTag light className="mb-5 justify-center">Rejoignez GI2E</SectionTag>
          <h1
            className="gi2e-h1 text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Construisons ensemble<br />
            <span className="text-[#4ade80]">un avenir plus propre</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            GI2E recrute des talents passionnés par l&apos;environnement et le développement
            durable. Rejoignez une équipe dynamique qui fait la différence chaque jour.
          </p>
        </div>
      </section>

      {/* Nos métiers */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <SectionTag className="mb-4 justify-center">Nos métiers</SectionTag>
            <h2
              className="gi2e-h2 text-[#052e16]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Des opportunités dans tous les domaines
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {metiers.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="bg-[#fafafa] rounded-2xl p-8 text-center gi2e-card-hover">
                  <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-[#f0fdf4] flex items-center justify-center">
                    <Icon className="h-7 w-7 text-[#22a05a]" />
                  </div>
                  <h3
                    className="text-lg font-bold text-[#052e16] mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {m.title}
                  </h3>
                  <p className="text-sm text-neutral-600">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Offres */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <SectionTag className="mb-4">Offres d&apos;emploi</SectionTag>
              <h2
                className="gi2e-h2 text-[#052e16]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Postes disponibles
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {offres.map((offre) => (
              <div
                key={offre.titre}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-neutral-100 hover:border-[#22a05a]/30 hover:shadow-sm transition-all gi2e-card-hover"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#f0fdf4] text-[#145e38]">
                      {offre.categorie}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      offre.type === 'CDI' ? 'bg-[#052e16] text-white' : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {offre.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#052e16] mb-1">{offre.titre}</h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {offre.lieu}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Temps plein
                    </span>
                  </div>
                </div>
                <a
                  href="mailto:info@gi2e-ci.com?subject=Candidature — GI2E"
                  className="shrink-0 px-5 py-2.5 rounded-xl bg-[#22a05a] text-white text-sm font-semibold hover:bg-[#1a7a4a] transition-colors"
                >
                  Postuler
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidature spontanée */}
      <section className="py-24 bg-[#0d3d22]">
        <div className="max-w-[700px] mx-auto px-6 md:px-10 text-center">
          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Upload className="h-7 w-7 text-[#4ade80]" />
          </div>
          <h2
            className="gi2e-h2 text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Candidature spontanée
          </h2>
          <p className="text-white/70 text-base mb-8">
            Votre profil ne correspond pas à une offre en cours ? Envoyez-nous votre
            CV et lettre de motivation — nous constituons une base de talents pour
            nos futures recrutements.
          </p>
          <a
            href="mailto:info@gi2e-ci.com?subject=Candidature spontanée — GI2E"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#22a05a] text-white font-bold hover:bg-[#1a7a4a] transition-colors"
          >
            Envoyer ma candidature
          </a>
        </div>
      </section>
    </div>
  );
}
