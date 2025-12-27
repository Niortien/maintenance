import { getAllInterventions } from "@/service/interventions/interventions.action";
import {
  IconTool,
  IconAlertTriangle,
  IconCheck,
  IconClock,
} from "@tabler/icons-react";
import { ReactNode } from "react";

export interface InterventionItem {
  title: string;
  chiffre?: number;
  description?: string;
  color?: string;
  chiffreColor?: string;
  icone?: ReactNode;
  urgency?: "normal" | "urgent";
}

// ⚡ Fonction pour compter les interventions récentes et urgentes
export const getInterventionStats = async () => {
  try {
    const data = await getAllInterventions();
    
    
    if (!data.success || !data.data) {
      return { recent: 0, urgent: 0 };
    }

    const interventions = Array.isArray(data.data) ? data.data : [];
    console.log('mes interventions',interventions)
    console.log('mon intervention n1',interventions[1].date)
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    
    // Interventions récentes = créées au plus 3 jours
    const recentCount = interventions.filter((i: { date?: string }) => {
      if (!i.date) return false;
      const creationDate = new Date(i.date);
      return creationDate >= threeDaysAgo;
    }).length;
    
    // Interventions urgentes = priorité HAUTE
    const urgentCount = interventions.filter(
      (i: { priorite: string }) => i.priorite === 'URGENTE'
    ).length;
    
    return {
      recent: recentCount,
      urgent: urgentCount
    };
  } catch (error) {
    console.error('Erreur lors du chargement des stats:', error);
    return { recent: 0, urgent: 0 };
  }
};

// ⚡ Fonction pour compter les interventions terminées et non terminées (2 ans)
export const getInterventionStatusStats = async () => {
  try {
    const response = await fetch('/api/interventions');
    const data = await response.json();
    
    if (!data.success || !data.data) {
      return { completed: 0, pending: 0 };
    }

    const interventions = Array.isArray(data.data) ? data.data : [];
    const now = new Date();
    const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
    
    // Filtrer les interventions des 2 dernières années
    const last2YearsInterventions = interventions.filter((i: { dateCreation?: string }) => {
      if (!i.dateCreation) return false;
      const creationDate = new Date(i.dateCreation);
      return creationDate >= twoYearsAgo;
    });
    
    // Interventions terminées
    const completedCount = last2YearsInterventions.filter(
      (i: { statut?: string }) => i.statut === 'TERMINÉE' || i.statut === 'COMPLETED'
    ).length;
    
    // Interventions non terminées
    const pendingCount = last2YearsInterventions.filter(
      (i: { statut?: string }) => i.statut !== 'TERMINÉE' && i.statut !== 'COMPLETED'
    ).length;
    
    return {
      completed: completedCount,
      pending: pendingCount
    };
  } catch (error) {
    console.error('Erreur lors du chargement des stats:', error);
    return { completed: 0, pending: 0 };
  }
};

export const interventionData: InterventionItem[] = [
  {
    title: "Interventions Récentes",
    chiffre: 0,
    description: "Interventions créées au plus 3 jours",
    color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    chiffreColor: "text-emerald-100",
    icone: <IconTool stroke={2} height={"30"} width={"30"} color="white" />,
    urgency: "normal",
  },
  {
    title: "Interventions Urgentes",
    chiffre: 0,
    description: "Interventions avec priorité HAUTE",
    color: "bg-red-500 border-2 border-green-500 text-green-600",
    chiffreColor: "text-",
    icone: (
      <IconAlertTriangle stroke={2} height={"30"} width={"30"} color="white" />
    ),
    urgency: "urgent",
  },
  {
    title: "Interventions Terminées",
    chiffre: 0,
    description: "Interventions complétées (derniers 2 ans)",
    color: "bg-gradient-to-br from-green-500 to-green-700",
    chiffreColor: "text-green-100",
    icone: <IconCheck stroke={2} height={"30"} width={"30"} color="white" />,
    urgency: "normal",
  },
  {
    title: "Interventions Non Terminées",
    chiffre: 0,
    description: "Interventions en attente (derniers 2 ans)",
    color: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    chiffreColor: "text-cyan-100",
    icone: <IconClock stroke={2} height={"30"} width={"30"} color="white" />,
    urgency: "normal",
  },
];
