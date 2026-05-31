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