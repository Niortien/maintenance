import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const navLinks = [
  { label: 'À propos', href: '/nous-connaitre' },
  { label: 'Entité & Gouvernance', href: '/nous-connaitre#gouvernance' },
  { label: "Zone d'intervention", href: '/zone-intervention' },
  { label: 'Nos services', href: '/solutions' },
  { label: 'Carrières', href: '/carrieres' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Contact', href: '/contact' },
];

const serviceLinks = [
  { label: 'Salubrité collectivités', href: '/solutions#collectivites' },
  { label: 'Salubrité entreprises', href: '/solutions#entreprises' },
  { label: 'BTP & Chantiers', href: '/solutions#btp' },
  { label: 'Documentation', href: '/solutions#documentation' },
];

const socials = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/pageofficielleGI2E',
    icon: Facebook,
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com/GroupementE',
    icon: Twitter,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/gi2e',
    icon: Linkedin,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@GI2EOfficiel',
    icon: Youtube,
  },
];

export default function GI2EFooter() {
  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-16 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Col 1 — Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-white">
                <Image
                  src="/assets/images/site/LOGO_GI2E-OK.png"
                  alt="GI2E Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <p
                  className="text-lg font-bold text-white leading-none"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  GI2E
                </p>
                <p className="text-[10px] text-[#4ade80] font-medium uppercase tracking-wider">
                  Eco Environnement
                </p>
              </div>
            </div>
            <p className="text-[#22a05a] text-sm font-medium italic mb-4">
              &ldquo;L&apos;environnement sain, notre business&rdquo;
            </p>
            <div className="space-y-2 text-sm text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#22a05a] mt-0.5 shrink-0" />
                <span>13 BP 2992 Abidjan 13, Côte d&apos;Ivoire</span>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-600 px-2 py-1 rounded border border-neutral-700">
                Fondé en 2013
              </span>
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-5">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-5">
              Services
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact & Socials */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-5">
              Contact
            </h4>
            <div className="space-y-3 mb-6">
              <a
                href="mailto:info@gi2e-ci.com"
                className="flex items-center gap-2.5 text-sm text-neutral-400 hover:text-white transition-colors group"
              >
                <Mail className="h-4 w-4 text-[#22a05a]" />
                info@gi2e-ci.com
              </a>
              <a
                href="tel:+2250173086710"
                className="flex items-center gap-2.5 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-[#22a05a]" />
                01 73 08 67 10
              </a>
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">
              Réseaux sociaux
            </h4>
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 hover:bg-[#145e38] hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} GI2E — Groupement Ivoire Eco Environnement. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
              Politique de confidentialité
            </Link>
            <span className="text-neutral-800">·</span>
            <Link href="/contact" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
