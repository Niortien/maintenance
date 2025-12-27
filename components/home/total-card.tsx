'use client';

import { totalData, TotalItem } from "@/data/total.data";
import { getAllVehicule } from "@/service/vehicule/vehicule.action";
import { getAllTechniciens } from "@/service/techniciens/technicien.action";
import { getAllInterventions } from "@/service/interventions/interventions.action";
import { IVehicule } from "@/service/vehicule/types/vehicule.type";
import { ITechnicien } from "@/service/techniciens/types/technicien.type";
import { IIntervention } from "@/service/interventions/types/interventions/intervention.type";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface CardTotalProps {
  item: TotalItem;
  index?: number;
  count?: number;
}

const CardTotal = ({ item, index = 0, count }: CardTotalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      className={`w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1rem)] h-52 m-2 flex flex-col justify-center gap-4 rounded-2xl ${item.color} p-6 text-white shadow-lg border border-white/10 backdrop-blur-sm hover:shadow-2xl hover:border-white/20 transition-all duration-300`}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="text-5xl opacity-90">{item.icone}</span>
        <span className={`${item.chiffreColor} font-bold text-3xl`}>
          {count !== undefined ? count : item.chiffre || 0}
        </span>
      </div>
      <div className="text-white/90 items-center flex justify-center text-center text-sm font-medium leading-relaxed">
        {item.description}
      </div>
    </motion.div>
  );
};

const TotalCard = () => {
  const [vehicules, setVehicules] = useState<IVehicule[]>([]);
  const [techniciens, setTechniciens] = useState<ITechnicien[]>([]);
  const [interventions, setInterventions] = useState<IIntervention[]>([]);

  const fetchData = async () => {
    try {
      const resVehicules = await getAllVehicule();
      if (resVehicules.success && "data" in resVehicules) {
        setVehicules(resVehicules.data);
      } else {
        toast.error(resVehicules.error || "Erreur lors du chargement des véhicules");
      }

      const resTechniciens = await getAllTechniciens();
      if (resTechniciens.success && "data" in resTechniciens) {
        setTechniciens(resTechniciens.data);
      } else {
        toast.error(resTechniciens.error || "Erreur lors du chargement des techniciens");
      }

      const resInterventions = await getAllInterventions();
      if (resInterventions.success && "data" in resInterventions) {
        setInterventions(resInterventions.data);
      } else {
        toast.error(resInterventions.error || "Erreur lors du chargement des interventions");
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

  // Calcul des valeurs
  const totalVehicules = vehicules.length;
  const vehiculesEnMaintenance = vehicules.filter((v) => v.statut === "MAINTENANCE" || v.statut === "EN_MAINTENANCE").length;
  const totalTechniciens = techniciens.length;
  const techniciensActifs = techniciens.filter((t) => t.statut === "ACTIF" || t.statut === "ACTIVE").length;
  
  // Calcul du temps moyen par intervention
  const tempsMoyen = interventions.length > 0 
    ? Math.round(interventions.reduce((acc, i) => acc + (i.temps_estime_heures || 0), 0) / interventions.length)
    : 0;

  const getValueForTitle = (title: string) => {
    switch (title) {
      case "Vehicules totale":
        return totalVehicules;
      case "Techniciens":
        return totalTechniciens;
      case "Temps Moyen":
        return tempsMoyen;
      default:
        return undefined;
    }
  };

  const getDescriptionForTitle = (title: string) => {
    switch (title) {
      case "Vehicules totale":
        return `${vehiculesEnMaintenance} en maintenance`;
      case "Techniciens":
        return `${techniciensActifs} actifs`;
      case "Temps Moyen":
        return `par intervention`;
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-wrap md:justify-start sm:justify-between lg:justify-between">
      {totalData.map((item, index) => (
        <CardTotal 
          key={index} 
          item={{ 
            ...item, 
            description: getDescriptionForTitle(item.title) 
          }} 
          index={index}
          count={getValueForTitle(item.title)}
        />
      ))}
    </div>
  );
};

export default TotalCard;
