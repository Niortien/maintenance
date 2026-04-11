'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AllStatistics } from '@/service/interventions/types/interventions/intervention.type';

interface OverviewHeaderProps {
  stats: AllStatistics;
}

const OverviewHeader: React.FC<OverviewHeaderProps> = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-8"
    >
      {/* Titre principal */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Dashboard Maintenance
        </h1>
        <p className="text-slate-600 text-lg">
          Vue d&apos;ensemble complète de votre système de maintenance
        </p>
      </div>

      {/* Cartes résumées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Carte Interventions */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 rounded-lg p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-3xl font-bold">{stats.interventions.total}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Interventions</h3>
          <p className="text-blue-100 text-sm">
            {stats.interventions.enCours} en cours, {stats.interventions.terminees} terminées
          </p>
        </motion.div>

        {/* Carte Techniciens */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 rounded-lg p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-3xl font-bold">{stats.techniciens.total}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Techniciens</h3>
          <p className="text-green-100 text-sm">
            {stats.techniciens.actifs} actifs ({stats.techniciens.tauxActivite}%)
          </p>
        </motion.div>

        {/* Carte Véhicules */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 rounded-lg p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-3xl font-bold">{stats.vehicules.total}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Véhicules</h3>
          <p className="text-purple-100 text-sm">
            {stats.vehicules.actifs} actifs ({stats.vehicules.tauxDisponibilite}% disponibles)
          </p>
        </motion.div>
      </div>

      {/* Indicateurs de performance */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Indicateurs Clés</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.interventions.urgentes}</div>
            <div className="text-sm text-slate-600">Interventions Urgentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.techniciens.tauxActivite}%</div>
            <div className="text-sm text-slate-600">Taux d&apos;Activité</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.vehicules.tauxDisponibilite}%</div>
            <div className="text-sm text-slate-600">Disponibilité</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.interventions.coutTotal}</div>
            <div className="text-sm text-slate-600">Coût Total</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewHeader;
