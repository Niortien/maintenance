'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface InterventionStats {
  total: number;
  enCours: number;
  terminees: number;
  urgentes: number;
  enAttente: number;
  coutTotal: number;
}

interface InterventionStatsSectionProps {
  stats: InterventionStats;
}

const InterventionStatsSection: React.FC<InterventionStatsSectionProps> = ({ stats }) => {
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
          <div className="bg-blue-100 rounded-lg p-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          Statistiques des Interventions
        </h2>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          Total: {stats.total}
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total"
          value={stats.total}
          subtitle="Toutes les interventions"
          icon={
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          delay={0.1}
          trend="neutral"
        />

        <StatCard
          title="En Cours"
          value={stats.enCours}
          subtitle={`${Math.round((stats.enCours / stats.total) * 100)}% du total`}
          icon={
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          delay={0.2}
          trend="up"
        />

        <StatCard
          title="Terminées"
          value={stats.terminees}
          subtitle={`${Math.round((stats.terminees / stats.total) * 100)}% du total`}
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          delay={0.3}
          trend="up"
        />
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Urgentes</p>
              <p className="text-2xl font-bold text-red-700">{stats.urgentes}</p>
            </div>
            <div className="bg-red-200 rounded-lg p-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">En Attente</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.enAttente}</p>
            </div>
            <div className="bg-yellow-200 rounded-lg p-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Coût Total</p>
              <p className="text-2xl font-bold text-purple-700">{stats.coutTotal}</p>
            </div>
            <div className="bg-purple-200 rounded-lg p-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mt-6 bg-slate-50 rounded-xl p-4">
        <h4 className="text-sm font-medium text-slate-600 mb-3">Répartition des interventions</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="bg-orange-500 rounded-lg h-2 mb-1" style={{ width: '100%' }}></div>
            <p className="text-xs text-slate-600">En cours: {stats.enCours}</p>
          </div>
          <div className="text-center">
            <div className="bg-green-500 rounded-lg h-2 mb-1" style={{ width: '100%' }}></div>
            <p className="text-xs text-slate-600">Terminées: {stats.terminees}</p>
          </div>
          <div className="text-center">
            <div className="bg-red-500 rounded-lg h-2 mb-1" style={{ width: '100%' }}></div>
            <p className="text-xs text-slate-600">Urgentes: {stats.urgentes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionStatsSection;
