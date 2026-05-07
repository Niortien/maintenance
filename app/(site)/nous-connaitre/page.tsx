import { Metadata } from 'next';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import SectionTag from '@/components/gi2e/ui/SectionTag';
import { Target, Eye, Heart, Leaf, Lightbulb, Award, Users } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: 'À propos — GI2E',
  description: "Découvrez l'histoire, la mission et les valeurs de GI2E, pionnier de l'assainissement urbain en Côte d'Ivoire depuis 2013.",
};

const timeline = [
  { year: '2013', title: 'Fondation', desc: "Création de GI2E à Abidjan par Dr. SOUMAHORO Youssouf avec pour vision un environnement sain pour tous." },
  { year: '2015', title: 'Expansion Abidjan', desc: "Déploiement de 200 premiers conteneurs dans les communes d'Abidjan. Premier contrat avec une collectivité locale." },
  { year: '2017', title: 'Bouaké & San-Pédro', desc: "Extension des services vers l'intérieur du pays. Bouaké et San-Pédro intègrent le réseau GI2E." },
  { year: '2019', title: 'Entrée au Togo', desc: "Ouverture des premiers services à Kpalimé, Togo. GI2E franchit les frontières nationales." },
  { year: '2021', title: '2 000 emplois', desc: "Le cap des 2 000 emplois directs et indirects est franchi. Lancement du programme BTP." },
  { year: '2023', title: '10 ans & 7 villes', desc: "Dixième anniversaire. GI2E dessert 7 villes dans 2 pays avec plus de 800 conteneurs déployés." },
];

const values = [
  { icon: Heart, label: 'Engagement', desc: 'Chaque mission est portée avec conviction et dévouement envers les populations que nous servons.' },
  { icon: Leaf, label: 'Durabilité', desc: 'Nos pratiques visent à préserver les ressources naturelles pour les générations futures.' },
  { icon: Lightbulb, label: 'Innovation', desc: 'Nous adoptons des solutions modernes pour relever les défis environnementaux complexes.' },
  { icon: Users, label: 'Responsabilité', desc: 'Acteur économique responsable, nous créons de la valeur pour toutes nos parties prenantes.' },
  { icon: Award, label: 'Excellence', desc: 'La qualité de nos services est notre marque de fabrique, à chaque intervention.' },
];

export default function NousConnaitrePage() {
  return (
    <div className={playfair.variable}>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#0d3d22] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/site/13-1024x768.jpg"
            alt="Équipes GI2E en parade sur le terrain"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 text-center">
          <SectionTag light className="mb-5 justify-center">À propos de GI2E</SectionTag>
          <h1
            className="gi2e-h1 text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Notre histoire,<br />
            <span className="text-[#4ade80]">notre mission</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Depuis 2013, GI2E bâtit un avenir plus propre pour les villes d&apos;Afrique de l&apos;Ouest,
            avec passion, expertise et un engagement sans faille envers l&apos;environnement.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#f0fdf4] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#22a05a] flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h3
                  className="text-xl font-bold text-[#052e16]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Notre Mission
                </h3>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                Assurer un service de gestion des déchets fiable, innovant et respectueux
                de l&apos;environnement pour les collectivités, entreprises et acteurs du BTP
                en Côte d&apos;Ivoire et au-delà, contribuant à l&apos;amélioration du cadre de vie
                des populations.
              </p>
            </div>
            <div className="bg-[#fef9e7] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#d4a017] flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <h3
                  className="text-xl font-bold text-[#052e16]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Notre Vision
                </h3>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                Devenir le leader régional de l&apos;assainissement urbain en Afrique de l&apos;Ouest,
                reconnu pour l&apos;excellence de ses services, son impact environnemental positif
                et sa contribution au développement durable du continent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <SectionTag className="mb-4 justify-center">Notre parcours</SectionTag>
            <h2
              className="gi2e-h2 text-[#052e16]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              10 ans de croissance et d&apos;impact
            </h2>
          </div>

          <div className="relative">
            {/* Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#dcfce7] -translate-x-1/2" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className="flex-1 md:text-right">
                    {i % 2 === 0 && (
                      <div className="ml-16 md:ml-0 bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                        <p className="text-xs font-bold text-[#22a05a] uppercase tracking-widest mb-1">{item.year}</p>
                        <h4 className="font-bold text-[#052e16] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</h4>
                        <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-start mt-6">
                    <div className="h-4 w-4 rounded-full bg-[#22a05a] border-4 border-white shadow" />
                  </div>

                  {/* Right side */}
                  <div className="flex-1">
                    {i % 2 !== 0 && (
                      <div className="ml-16 md:ml-0 bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                        <p className="text-xs font-bold text-[#22a05a] uppercase tracking-widest mb-1">{item.year}</p>
                        <h4 className="font-bold text-[#052e16] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</h4>
                        <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <SectionTag className="mb-4 justify-center">Ce qui nous guide</SectionTag>
            <h2
              className="gi2e-h2 text-[#052e16]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Nos valeurs fondamentales
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.label} className="bg-[#fafafa] rounded-2xl p-6 text-center gi2e-card-hover">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
                    <Icon className="h-6 w-6 text-[#22a05a]" />
                  </div>
                  <h4 className="font-bold text-[#052e16] mb-2">{val.label}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
