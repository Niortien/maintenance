'use client'

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { IIntervention } from "@/service/interventions/types/interventions/intervention.type";
import { ITechnicien } from "@/service/techniciens/types/technicien.type";
import { IVehicule } from "@/service/vehicule/types/vehicule.type";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query'
import { getAllStatistics, getInterventionStats } from '@/service/interventions/interventions.action';
import { getAllTechniciens } from '@/service/techniciens/technicien.action';
import { getAllVehicule } from '@/service/vehicule/vehicule.action';

interface BilanItem {
  title: string;
  chiffre: number;
  color: string;
  chiffreColor: string;
  icone: React.ReactNode;
}

interface CardBilanProps {
  item: BilanItem;
  value?: number;
  index?: number;
}

const CardBilan = ({ item, value, index = 0 }: CardBilanProps) => {
  const isWhiteBg = item.color?.includes("bg-white");
  
  // Utiliser les données passées en props plutôt que de faire un appel API
  // Les statistiques sont calculées dans le composant parent BilanCard
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)] h-36 m-2 flex justify-between items-center p-6 rounded-2xl  ${item.color} ${isWhiteBg ? 'text-emerald-600' : 'text-white'} shadow-lg border border-white/10 backdrop-blur-sm hover:shadow-2xl transition-all duration-300`}
    >
      <div className="flex flex-col justify-between items-start gap-2 flex-1">
        <span className={`${isWhiteBg ? 'text-emerald-600/80' : 'text-white/80'} font-medium text-sm uppercase tracking-wide`}>{item.title}</span>
        <span className={`${item.chiffreColor} font-bold text-4xl`}>
          {value !== undefined ? value : item.chiffre}
        </span>
      </div>
      <div className="flex items-center justify-center ml-4 text-5xl opacity-80">{item.icone}</div>
    </motion.div>
  );
};

const BilanCard = () => {
  const [techniciens, setTechniciens] = useState<ITechnicien[]>([]);
  const [vehicules, setVehicules] = useState<IVehicule[]>([]);

  // Utiliser useQuery pour les statistiques d'interventions
  const { data: statsData, isPending: statsPending, error: statsError } = useQuery({
    queryKey: ['interventionsstats'],
    queryFn: () => getInterventionStats(),
  });

  const fetchData = async () => {
    try {
      const resTechniciens = await getAllTechniciens();
      if (resTechniciens.success && "data" in resTechniciens) {
        setTechniciens(resTechniciens.data);
      } else {
        toast.error(resTechniciens.error || "Erreur lors du chargement des techniciens");
      }

      const resVehicules = await getAllVehicule();
      if (resVehicules.success && "data" in resVehicules) {
        setVehicules(resVehicules.data);
      } else {
        toast.error(resVehicules.error || "Erreur lors du chargement des véhicules");
      }
    } catch {
      toast.error("Erreur inattendue");
    }
  };

  useEffect(() => {
    fetchData();
    // Rafraîchir chaque 30 secondes
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Utiliser les données de l'API si disponibles, sinon fallback sur 0
  const stats = statsData?.success ? statsData.data : null;
  const totalInterventions = stats?.totalInterventions ?? 0;
  const enCours = stats?.interventionsEnCours ?? 0;
  const terminees = stats?.interventionsTerminees ?? 0;
  const urgentes = stats?.interventionsUrgentes ?? 0;
  const totalTechniciens = techniciens.length;
  const totalVehicules = vehicules.length;

  const getValueForTitle = (title: string) => {
    switch (title) {
      case "Total Interventions":
        return totalInterventions;
      case "En Cours":
        return enCours;
      case "Terminées":
        return terminees;
      case "Urgentes":
        return urgentes;
      case "Total Techniciens":
        return totalTechniciens;
      case "Total Vehicules":
        return totalVehicules;
      default:
        return undefined;
    }
  };

  if (statsPending) {
    return <div className="flex justify-center p-8">Chargement des statistiques...</div>;
  }

  if (statsError) {
    return <div className="flex justify-center p-8 text-red-500">Erreur de chargement des statistiques</div>;
  }

  return (
    <div className="flex flex-wrap md:justify-start sm:justify-between lg:justify-between">
      {bilanData.map((item: BilanItem, index: number) => (
        <CardBilan key={index} item={item} value={getValueForTitle(item.title)} index={index} />
      ))}
    </div>
  );
};

export default BilanCard;

// Données du bilan
const bilanData: BilanItem[] = [
  {
    title: "Total Interventions",
    chiffre: 0,
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
    chiffreColor: "text-white",
    icone: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  },
  {
    title: "En Cours",
    chiffre: 0,
    color: "bg-gradient-to-r from-orange-500 to-orange-600",
    chiffreColor: "text-white",
    icone: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  },
  {
    title: "Terminées",
    chiffre: 0,
    color: "bg-gradient-to-r from-green-500 to-green-600",
    chiffreColor: "text-white",
    icone: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  },
  {
    title: "Urgentes",
    chiffre: 0,
    color: "bg-gradient-to-r from-red-500 to-red-600",
    chiffreColor: "text-white",
    icone: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  },
  {
    title: "Total Techniciens",
    chiffre: 0,
    color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    chiffreColor: "text-white",
    icone: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  },
  {
    title: "Total Vehicules",
    chiffre: 0,
    color: "bg-gradient-to-r from-purple-500 to-purple-600",
    chiffreColor: "text-white",
    icone: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  }
];
