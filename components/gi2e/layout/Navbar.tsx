'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LayoutDashboard, ShieldCheck } from 'lucide-react';

const navLinks = [
  { label: 'À propos', href: '/nous-connaitre' },
  { label: 'Services', href: '/solutions' },
  { label: 'Zones', href: '/zone-intervention' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Carrières', href: '/carrieres' },
];

export default function GI2ENavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backOfficeOpen, setBackOfficeOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setBackOfficeOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-md bg-white">
              <Image
                src="/assets/images/site/LOGO_GI2E-OK.png"
                alt="GI2E Logo"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className={`font-bold text-lg tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-[#052e16]' : 'text-white'
                }`}
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                GI2E
              </span>
              <span
                className={`text-[10px] font-medium tracking-wider uppercase transition-colors duration-300 ${
                  scrolled ? 'text-[#22a05a]' : 'text-[#4ade80]'
                }`}
              >
                Eco Environnement
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    scrolled
                      ? isActive
                        ? 'text-[#145e38]'
                        : 'text-neutral-700 hover:text-[#145e38]'
                      : isActive
                      ? 'text-[#4ade80]'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full transition-transform duration-300 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    } ${scrolled ? 'bg-[#22a05a]' : 'bg-[#4ade80]'}`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right: CTA + Back-office dropdown */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Back-office access */}
            <div className="relative">
              <button
                onClick={() => setBackOfficeOpen(!backOfficeOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                  scrolled
                    ? 'border-neutral-200 text-neutral-600 hover:border-[#22a05a] hover:text-[#22a05a]'
                    : 'border-white/30 text-white/80 hover:border-white hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Accès espace
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${backOfficeOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {backOfficeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl shadow-black/10 border border-neutral-100 overflow-hidden z-50"
                  >
                    <div className="p-1.5">
                      <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                        Back-office
                      </p>
                      <Link
                        href="/login"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors group"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                          <LayoutDashboard className="h-4 w-4 text-emerald-700" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-800">Responsable de site</p>
                          <p className="text-xs text-neutral-500">Gérer vos activités</p>
                        </div>
                      </Link>
                      <Link
                        href="/admin/login"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-amber-50 transition-colors group"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 group-hover:bg-amber-200 transition-colors">
                          <ShieldCheck className="h-4 w-4 text-amber-700" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-800">Administrateur</p>
                          <p className="text-xs text-neutral-500">Gestion globale</p>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact CTA */}
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-[#22a05a] text-white text-sm font-semibold shadow-lg shadow-green-900/20 hover:bg-[#1a7a4a] transition-all duration-200 hover:shadow-green-900/30"
            >
              Nous contacter
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-neutral-700 hover:bg-neutral-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-6 w-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-white/98 backdrop-blur-md border-t border-neutral-100"
          >
            <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-[#f0fdf4] text-[#145e38] font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-2 pt-3 border-t border-neutral-100 flex flex-col gap-2">
                <p className="px-4 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  Accès espace
                </p>
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-medium"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Responsable de site
                </Link>
                <Link
                  href="/admin/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 text-amber-800 text-sm font-medium"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Administrateur
                </Link>
                <Link
                  href="/contact"
                  className="mt-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#22a05a] text-white text-sm font-semibold"
                >
                  Nous contacter →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
