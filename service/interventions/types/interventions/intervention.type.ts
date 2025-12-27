// types/intervention.type.ts

export interface IIntervention {
  id:string
  date: string;                    // ex: "15/10/2023"
  description: string;             // ex: "Le moteur ne démarre pas"
  situation: string;               // ex: "Le véhicule est en panne"
  designation: string;             // ex: "Remplacement batterie"
  priorite: "FAIBLE" | "MOYENNE" | "URGENTE"| "ELEVEE";  // Enum Priorité
  cout: number;                    // ex: 150.75
  temps_estime_heures: number;     // ex: 2
  temps_reel_heures?: number;      // ex: 1.5 (optionnel)
  pieces_utilisees?: string;       // ex: "Batterie, câbles" (optionnel)
  notes_additionnelles?: string;   // ex: "Réparation réussie" (optionnel)
  statut: "EN_COURS" | "TERMINEE" | "ANNULEE"; // Enum Statut
  vehiculeId: string;              // ex: "vehicule-ulid-id"
  technicienId: string;            // ex: "technicien-ulid-id"
}

export type CreateInterventionType = {
  date: string; // transformé en ISO string
  description: string;
  situation: string;
  designation: string;
 priorite: "FAIBLE" | "MOYENNE" | "URGENTE"| "ELEVEE"; 
  cout: number;
  temps_estime_heures?: number;
  temps_reel_heures?: number;
  pieces_utilisees?: string;
  notes_additionnelles?: string;
  statut: "EN_COURS" | "TERMINEE" | "ANNULEE";
  vehiculeId: string;
  technicienId: string;
  createdAt   :string         
  updatedAt :string
};
