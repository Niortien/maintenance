import { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import SectionTag from '@/components/gi2e/ui/SectionTag';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: 'Contact — GI2E',
  description: "Contactez GI2E pour vos besoins en gestion des déchets et assainissement.",
};

export default function ContactPage() {
  return (
    <div className={playfair.variable}>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#fafafa] border-b border-neutral-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <SectionTag className="mb-4">Nous contacter</SectionTag>
          <h1
            className="gi2e-h1 text-[#052e16] max-w-2xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Parlons de votre <span className="text-[#22a05a]">projet</span>
          </h1>
          <p className="text-neutral-600 text-lg mt-4 max-w-xl">
            Notre équipe est disponible pour répondre à toutes vos questions
            et vous accompagner dans vos besoins en gestion des déchets.
          </p>
        </div>
      </section>

      {/* Contact info + Form */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-[2fr_3fr] gap-12">

            {/* Info */}
            <div>
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-[#22a05a]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">Email</p>
                    <a href="mailto:info@gi2e-ci.com" className="text-[#052e16] font-medium hover:text-[#22a05a] transition-colors">
                      info@gi2e-ci.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-[#22a05a]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">Téléphone</p>
                    <a href="tel:+2250173086710" className="text-[#052e16] font-medium hover:text-[#22a05a] transition-colors">
                      01 73 08 67 10
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-[#22a05a]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">Adresse</p>
                    <p className="text-[#052e16] font-medium">13 BP 2992 Abidjan 13<br />Côte d&apos;Ivoire</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-[#22a05a]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">Horaires</p>
                    <p className="text-[#052e16] font-medium">Lun – Ven : 8h – 18h<br />Samedi : 9h – 13h</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden h-48 bg-[#f0fdf4] border border-[#dcfce7]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.45347009875!2d-4.1095994!3d5.3599517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea5311959b9b%3A0x7f90f62ca7de46d5!2sAbidjan!5e0!3m2!1sfr!2sci!4v1680000000000!5m2!1sfr!2sci"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="GI2E — Abidjan, Côte d'Ivoire"
                />
              </div>
            </div>

            {/* Form */}
            <div className="bg-[#fafafa] rounded-2xl p-8">
              <h2
                className="text-2xl font-bold text-[#052e16] mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Envoyez-nous un message
              </h2>
              <form
                action="mailto:info@gi2e-ci.com"
                method="get"
                encType="text/plain"
                className="space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      name="nom"
                      required
                      type="text"
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#22a05a]/30 focus:border-[#22a05a] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                      Email *
                    </label>
                    <input
                      name="email"
                      required
                      type="email"
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#22a05a]/30 focus:border-[#22a05a] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                    Type de demande
                  </label>
                  <select
                    name="type"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#22a05a]/30 focus:border-[#22a05a] transition-all"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option>Demande de devis</option>
                    <option>Partenariat</option>
                    <option>Recrutement</option>
                    <option>Renseignements</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                    Sujet *
                  </label>
                  <input
                    name="sujet"
                    required
                    type="text"
                    placeholder="Objet de votre message"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#22a05a]/30 focus:border-[#22a05a] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Décrivez votre besoin..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#22a05a]/30 focus:border-[#22a05a] transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#22a05a] text-white font-bold text-sm hover:bg-[#1a7a4a] transition-colors shadow-lg shadow-green-900/20"
                >
                  <Send className="h-4 w-4" />
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
