'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin, User, Phone, Car, Users, FileText, Activity,
  AlertTriangle, CheckCircle, ArrowLeft, Calendar,
} from 'lucide-react';
import { ISiteDashboard } from '@/service/site/types/site.type';

interface SiteDashboardProps {
  dashboard: ISiteDashboard;
}

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </motion.div>
);

const statutBadge = (statut: string) => {
  const map: Record<string, string> = {
    ACTIF: 'bg-green-100 text-green-700',
    INACTIF: 'bg-slate-100 text-slate-600',
    EN_MAINTENANCE: 'bg-yellow-100 text-yellow-700',
    EN_PANNE: 'bg-red-100 text-red-700',
  };
  return map[statut] ?? 'bg-slate-100 text-slate-500';
};

const SiteDashboard = ({ dashboard }: SiteDashboardProps) => {
  const { site, responsable, stats, vehicules, techniciens, derniersRapports } = dashboard;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <Link href="/sites" className="mt-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-500" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <MapPin className="h-7 w-7 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{site.nom}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                  {site.code}
                </span>
                {site.region && <span className="text-sm text-slate-500 dark:text-slate-400">{site.region}</span>}
              </div>
            </div>
          </div>

          {responsable && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 w-fit">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                  {responsable.nom} {responsable.prenom}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Responsable du site</p>
              </div>
              {responsable.telephone && (
                <div className="flex items-center gap-1 text-xs text-blue-600 ml-2">
                  <Phone className="h-3 w-3" />
                  {responsable.telephone}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Statistiques</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Véhicules total" value={stats.vehiculesTotal} icon={Car} color="bg-blue-500" />
          <StatCard label="Véhicules actifs" value={stats.vehiculesActifs} icon={CheckCircle} color="bg-green-500" />
          <StatCard label="En panne" value={stats.vehiculesEnPanne} icon={AlertTriangle} color="bg-red-500" />
          <StatCard label="Techniciens total" value={stats.techniciensTotal} icon={Users} color="bg-purple-500" />
          <StatCard label="Techniciens actifs" value={stats.techniciensActifs} icon={Activity} color="bg-teal-500" />
          <StatCard label="Rapports" value={stats.rapportsTotal} icon={FileText} color="bg-orange-500" />
        </div>
      </div>

      {/* Véhicules */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Véhicules affectés
        </h2>
        {vehicules.length === 0 ? (
          <p className="text-sm text-slate-400">Aucun véhicule affecté à ce site.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vehicules.map((v) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-white">{v.nom}</p>
                    <p className="text-xs text-slate-500">{v.numero_de_plaque} · {v.type}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statutBadge(v.statut)}`}>
                  {v.statut}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Techniciens */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Techniciens du site
        </h2>
        {techniciens.length === 0 ? (
          <p className="text-sm text-slate-400">Aucun technicien affecté à ce site.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {techniciens.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-white">{t.nom} {t.prenom}</p>
                    <p className="text-xs text-slate-500">{t.specialite}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statutBadge(t.statut)}`}>
                  {t.statut}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Derniers rapports */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Derniers rapports journaliers
        </h2>
        {derniersRapports.length === 0 ? (
          <p className="text-sm text-slate-400">Aucun rapport pour ce site.</p>
        ) : (
          <div className="space-y-2">
            {derniersRapports.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-orange-400" />
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-white">
                      Rapport du {new Date(r.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-slate-500">{r.lignes?.length ?? 0} ligne(s)</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="h-3 w-3" />
                  {new Date(r.date).toLocaleDateString('fr-FR')}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteDashboard;
