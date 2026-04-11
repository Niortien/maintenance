'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TechnicienStats {
  total: number;
  actifs: number;
  tauxActivite: string;
}

interface TechnicienStatsSectionProps {
  stats: TechnicienStats;
}

const TechnicienStatsSection: React.FC<TechnicienStatsSectionProps> = ({ stats }) => {
  const inactifs = stats.total - stats.actifs;
  const tauxNumerique = parseFloat(stats.tauxActivite);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    delay,
    trend
  }: { 
    title: string; 
    value: number | string; 
    subtitle?: string; 
    icon: React.ReactNode; 
    delay: number;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-slate-100 rounded-lg p-3">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-green-100 text-green-700' : 
            trend === 'down' ? 'bg-red-100 text-red-700' : 
            'bg-slate-100 text-slate-600'
          }`}>
            {trend === 'up' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>}
            {trend === 'down' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>}
            {trend === 'neutral' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="bg-green-100 rounded-lg p-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          Statistiques des Techniciens
        </h2>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          {stats.tauxActivite}% actifs
        </div>
      </div>

      {/* Cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard
          title="Techniciens Actifs"
          value={stats.actifs}
          subtitle={`${Math.round((stats.actifs / stats.total) * 100)}% de l'équipe totale`}
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          delay={0.1}
          trend="up"
        />

        <StatCard
          title="Total Techniciens"
          value={stats.total}
          subtitle="Effectif complet de l'équipe"
          icon={
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          delay={0.2}
          trend="neutral"
        />
      </div>

      {/* Indicateurs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Taux d&apos;activité</p>
              <p className="text-2xl font-bold text-green-700">{stats.tauxActivite}%</p>
            </div>
            <div className="bg-green-200 rounded-lg p-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${tauxNumerique}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Disponibilité</p>
              <p className="text-2xl font-bold text-blue-700">{stats.actifs}/{stats.total}</p>
            </div>
            <div className="bg-blue-200 rounded-lg p-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-blue-600 text-xs mt-2">Techniciens disponibles</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Inactifs</p>
              <p className="text-2xl font-bold text-orange-700">{inactifs}</p>
            </div>
            <div className="bg-orange-200 rounded-lg p-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-orange-600 text-xs mt-2">Non disponibles</p>
        </motion.div>
      </div>

      {/* Graphique circulaire du taux d'activité */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h4 className="text-sm font-medium text-slate-600 mb-4">Répartition de l&apos;activité</h4>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e2e8f0"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#10b981"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - tauxNumerique / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{stats.tauxActivite}%</p>
                <p className="text-xs text-slate-600">Actifs</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Actifs ({stats.actifs})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
            <span className="text-sm text-slate-600">Inactifs ({inactifs})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicienStatsSection;
