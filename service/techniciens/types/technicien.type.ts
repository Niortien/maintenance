export interface ITechnicien{
  id: string;
nom: string;
prenom: string;
email: string;
telephone: string;
specialite: string;
statut: string;
lieuMission?: string | null;
photo?: string | null;
}

export interface IHistoriqueStatut {
  id: string;
  statut: string;
  dateDebut: string;
  dateFin?: string | null;
  lieu?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface ITechnicienDetails extends ITechnicien {
  site: { id: string; nom: string; region?: string | null; couleur?: string | null };
  historique: IHistoriqueStatut[];
  interventions: { id: string; date: string; description: string; statut: string }[];
}

export interface TechnicienStats {
    totalTechniciens: number;
    techniciensActifs: number;
    techniciensEnMaintenance: number;
    techniciensInactifs: number;
    techniciensEnMission: number;
    techniciensEnConge: number;
    techniciensMalades: number;
    techniciensAvecInterventionsEnCours: number;
}