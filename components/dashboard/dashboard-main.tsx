'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getAllStatistics } from '@/service/interventions/interventions.action';
import toast from 'react-hot-toast';
import InterventionStatsSection from './sections/intervention-stats-section';
import TechnicienStatsSection from './sections/technicien-stats-section';
import VehiculeStatsSection from './sections/vehicule-stats-section';
import OverviewHeader from './sections/overview-header';
import QuickAccessSection from './sections/quick-access-section';

const DashboardMain = () => {
  const { data: statsData, isPending, error } = useQuery({
    queryKey: ['statistics', 'all'],
    queryFn: () => getAllStatistics(),
  });
  

  React.useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des statistiques");
    } else if (!statsData?.success && statsData?.error) {
      toast.error(statsData.error);
    }
  }, [error, statsData]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-slate-600 font-medium">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = statsData?.success ? statsData.data : null;

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium text-xl">Erreur de chargement</p>
          <p className="text-slate-500 mt-2">Impossible de charger les statistiques</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec vue d'ensemble */}
        <OverviewHeader stats={stats} />

        {/* Accès rapide */}
        <QuickAccessSection />

        {/* Sections des statistiques */}
        <div className="space-y-8 mt-8">
          {/* Section Interventions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <InterventionStatsSection stats={stats.interventions} />
          </motion.div>

          {/* Section Techniciens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TechnicienStatsSection stats={stats.techniciens} />
          </motion.div>

          {/* Section Véhicules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <VehiculeStatsSection stats={stats.vehicules} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
