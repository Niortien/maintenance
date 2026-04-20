'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wrench, LayoutDashboard, Car, Users, Briefcase, MapPin, FileText, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/service/auth/auth.action';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface ResponsableInfo {
  prenom: string;
  nom: string;
  site: { nom: string; couleur?: string | null };
}

const navItems: NavItem[] = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Interventions', href: '/interventions', icon: Briefcase },
  { name: 'Véhicules', href: '/vehicules', icon: Car },
  { name: 'Techniciens', href: '/techniciens', icon: Users },
  { name: 'Sites', href: '/sites', icon: MapPin },
  { name: 'Rapports', href: '/rapports', icon: FileText },
];

const HIDDEN_ROUTES = ['/', '/login', '/admin'];

export default function Header1({ responsable }: { responsable?: ResponsableInfo | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hide = HIDDEN_ROUTES.some((r) => pathname === r || pathname.startsWith('/admin') || pathname.startsWith('/login'));
  if (hide) return null;

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-emerald-900/95 backdrop-blur-md shadow-xl shadow-emerald-900/30'
          : 'bg-emerald-900'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 shadow-md group-hover:bg-amber-300 transition-colors">
              <Wrench className="h-5 w-5 text-emerald-900" />
            </div>
            <span className="hidden sm:block text-lg font-bold text-white tracking-tight">
              Maintenance<span className="text-amber-400">Pro</span>
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-400 text-emerald-900'
                      : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Utilisateur connecté */}
          {responsable && (
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full ring-2 ring-white/20"
                  style={{ backgroundColor: responsable.site.couleur ?? '#10b981' }}
                />
                <span className="text-sm text-emerald-100">
                  {responsable.prenom} ·{' '}
                  <span className="font-semibold text-white">{responsable.site.nom}</span>
                </span>
              </div>
              <Link
                href="/dashboard"
                className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-700/60 text-emerald-100 hover:bg-emerald-700 transition"
              >
                Mon site
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  title="Se déconnecter"
                  className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-800 hover:text-white transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-emerald-100 hover:bg-emerald-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden pb-4"
            >
              <div className="flex flex-col gap-1 pt-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-amber-400 text-emerald-900'
                          : 'text-emerald-100 hover:bg-emerald-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
