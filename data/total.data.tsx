import {
  IconCar,
  IconClockHour1,
  IconUser
} from "@tabler/icons-react";
import { ReactNode } from "react";
export interface TotalItem {
  title: string;
  chiffre?: number;
  description?: string;
  color?: string;
  chiffreColor?: string;
  icone?: ReactNode;
}

export const totalData: TotalItem[] = [
  {
    title: "Vehicules totale",
    
    description: " en maintenance",
    color: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    chiffreColor: "text-white",
    icone: <IconCar stroke={2} height={"44"} width={"44"} color="white" />,
  },
  {
    title: "Techniciens",
    
    description: " actifs",
    color: "bg-gradient-to-tl from-green-600 to-green-900  ",
    chiffreColor: "text-white",
    icone: (
      <IconUser stroke={2} height={"44"} width={"44"} color="white" />
    ),
  },
  {
    title: "Temps Moyen",
    chiffre: 0,
    description: "par intervention",
    color: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    chiffreColor: "text-white",
    icone: (
      <IconClockHour1 stroke={2} height={"44"} width={"44"} color="white" />
    ),
  },
];
