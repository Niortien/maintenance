'use client';

import { motion } from 'framer-motion';
import { FileText, MapPin, Wrench, Car, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const pages = [
  {
    href: '/sites',
    label: 'Sites',
    description: 'Gérer les sites logistiques',
    icon: <MapPin className="h-7 w-7" />,
    gradient: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-600',
  },
  {
    href: '/rapports',
    label: 'Rapports journaliers',
    description: 'Situation logistique par site',
    icon: <FileText className="h-7 w-7" />,
    gradient: 'from-red-500 to-orange-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600',
  },
  {
    href: '/interventions',
    label: 'Interventions',
    description: 'Planifier et suivre les interventions',
    icon: <Wrench className="h-7 w-7" />,
    gradient: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600',
  },
  {
    href: '/vehicules',
    label: 'Véhicules',
    description: 'Gérer le parc automobile',
    icon: <Car className="h-7 w-7" />,
    gradient: 'from-purple-500 to-violet-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600',
  },
  {
    href: '/techniciens',
    label: 'Techniciens',
    description: 'Gérer les techniciens',
    icon: <Users className="h-7 w-7" />,
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600',
  },
];

const QuickAccessSection = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Accès rapide</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {pages.map((page, i) => (
          <motion.div
            key={page.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ scale: 1.03, y: -4 }}
          >
            <Link href={page.href}
              className={`flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 ${page.bg} hover:shadow-lg transition-all group`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${page.gradient} flex items-center justify-center text-white shadow-md`}>
                {page.icon}
              </div>
              <div>
                <p className={`font-semibold ${page.text} text-sm`}>{page.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{page.description}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${page.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                Accéder <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessSection;
