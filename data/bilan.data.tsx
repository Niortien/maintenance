import { IconArrowZigZag, IconClockHour1, IconCoin, IconTool, IconAlertTriangle } from "@tabler/icons-react";
import { ReactNode } from "react";
export interface BilanItem {
  title: string;
  chiffre: number;
  description: string;
  imageUrl: string;
  color?: string;
  chiffreColor?: string;
  icone?:ReactNode ;
  
}

export const bilanData: BilanItem[] = [
  {
    title: "Total Interventions",
    chiffre: 0,
    description: "Nombre total d'interventions",
    imageUrl: "/images/sales.png",
    color: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    chiffreColor: "text-white",
    icone:<IconTool stroke={2} height={'50'}  width={'50'}  color="white" />,
  },
  {
    title: "En Cours",
    chiffre: 0,
    description: "Interventions en cours de traitement",
    imageUrl: "/images/customers.png",
    color: "bg-white border-2 border-emerald-500",
    chiffreColor: "text-emerald-600",
    icone:<IconClockHour1 stroke={2} height={'50'}  width={'50'} color="rgb(16, 185, 129)"  />
  },
  {
    title: "Terminées",
    chiffre: 0,
    description: "Interventions complétées avec succès",
    imageUrl: "/images/orders.png",
    color: "bg-gradient-to-br from-green-500 to-green-700",
    chiffreColor: "text-white",
    icone:<IconArrowZigZag stroke={2} height={'50'}  width={'50'} color="white" />,
  },
  {
    title: "Urgentes",
    chiffre: 0,
    description: "Interventions avec priorité HAUTE",
    imageUrl: "/images/tickets.png",
    color: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    chiffreColor: "text-white",
    icone: <IconAlertTriangle stroke={2} width={"60"}  height={"60"} color="white" />,
  },
];
