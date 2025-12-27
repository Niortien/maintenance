'use client';

import { interventionData, getInterventionStats, getInterventionStatusStats } from "@/data/intervention.data";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CardInterventionProps {
  item: typeof interventionData[0];
  index?: number;
  count?: number;
}

const CardIntervention = ({ item, index = 0, count = 0 }: CardInterventionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      className={`w-full sm:w-[calc(50%-1rem)] md:w-[calc(50%-1rem)] lg:w-[calc(50%-1rem)] h-48 m-2 flex flex-col justify-between rounded-2xl  ${item.color} p-6 text-white shadow-lg border border-white/10 backdrop-blur-sm hover:shadow-2xl hover:border-white/20 transition-all duration-300`}
    >
      <div className="flex gap-3 items-center">
        <span className="text-4xl">{item.icone}</span>
        <div className="flex-1">
          <span className="text-white font-bold text-lg block">
            {item.title}
          </span>
          <span className={`text-2xl font-bold mt-1 block ${item.chiffreColor}`}>
            {count !== undefined ? count : 0}
          </span>
        </div>
      </div>
      <div className="text-white/90 text-sm leading-relaxed font-medium">
        {item.description}
      </div>
    </motion.div>
  );
};

const InterventionCard = () => {
  const [stats, setStats] = useState({ recent: 0, urgent: 0 });
  const [statusStats, setStatusStats] = useState({ completed: 0, pending: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getInterventionStats();
        setStats(data);
        const statusData = await getInterventionStatusStats();
        setStatusStats(statusData);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    loadStats();
    // Rafraîchir chaque 30 secondes
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap md:justify-start sm:justify-between lg:justify-between">
      {interventionData.map((item, index) => (
        <CardIntervention
          key={index}
          item={item}
          index={index}
          count={
            index === 0 ? stats.recent : 
            index === 1 ? stats.urgent :
            index === 2 ? statusStats.completed :
            statusStats.pending
          }
        />
      ))}
    </div>
  );
};

export default InterventionCard;
