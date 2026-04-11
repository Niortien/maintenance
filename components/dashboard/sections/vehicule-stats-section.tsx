'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface VehiculeStats {
  total: number;
  actifs: number;
  enMaintenance: number;
  tauxDisponibilite: string;
}

interface VehiculeStatsSectionProps {
  stats: VehiculeStats;
}

const VehiculeStatsSection: React.FC<VehiculeStatsSectionProps> = ({ stats }) => {
  const inactifs = stats.total - stats.actifs;
  const tauxNumerique = parseFloat(stats.tauxDisponibilite);

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
          <div className="bg-purple-100 rounded-lg p-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          Statistiques des Véhicules
        </h2>
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
          {stats.tauxDisponibilite}% disponibles
        </div>
      </div>

      {/* Cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard
          title="Véhicules Actifs"
          value={stats.actifs}
          subtitle={`${Math.round((stats.actifs / stats.total) * 100)}% du parc total`}
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          delay={0.1}
          trend="up"
        />

        <StatCard
          title="Parc Complet"
          value={stats.total}
          subtitle="Total des véhicules en gestion"
          icon={
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
          className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Disponibilité</p>
              <p className="text-2xl font-bold text-purple-700">{stats.tauxDisponibilite}%</p>
            </div>
            <div className="bg-purple-200 rounded-lg p-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="bg-purple-200 rounded-full h-2">
              <div 
                className="bg-purple-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${tauxNumerique}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">En Maintenance</p>
              <p className="text-2xl font-bold text-orange-700">{stats.enMaintenance}</p>
            </div>
            <div className="bg-orange-200 rounded-lg p-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-orange-600 text-xs mt-2">Véhicules indisponibles</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Inactifs</p>
              <p className="text-2xl font-bold text-red-700">{inactifs}</p>
            </div>
            <div className="bg-red-200 rounded-lg p-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
          <p className="text-red-600 text-xs mt-2">Hors service</p>
        </motion.div>
      </div>

      {/* Barres de progression détaillées */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h4 className="text-sm font-medium text-slate-600 mb-4">État du parc automobile</h4>
        
        <div className="space-y-4">
          {/* Barre Actifs */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Actifs</span>
              <span className="text-sm text-slate-600">{stats.actifs}/{stats.total}</span>
            </div>
            <div className="bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 rounded-full h-3 transition-all duration-700"
                style={{ width: `${(stats.actifs / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Barre Maintenance */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">En Maintenance</span>
              <span className="text-sm text-slate-600">{stats.enMaintenance}/{stats.total}</span>
            </div>
            <div className="bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-full h-3 transition-all duration-700"
                style={{ width: `${(stats.enMaintenance / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Barre Inactifs */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Inactifs</span>
              <span className="text-sm text-slate-600">{inactifs}/{stats.total}</span>
            </div>
            <div className="bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-red-400 to-red-600 rounded-full h-3 transition-all duration-700"
                style={{ width: `${(inactifs / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Légende */}
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Actifs ({stats.actifs})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Maintenance ({stats.enMaintenance})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Inactifs ({inactifs})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiculeStatsSection;
