export interface ITechnicien{
  id: string;
nom: string;
prenom: string;
email: string;
telephone: string;
specialite: string;
statut: string;
}

export interface TechnicienStats {
    totalTechniciens: number;
    techniciensActifs: number;
    techniciensEnMaintenance: number;
    techniciensInactifs: number;
    techniciensAvecInterventionsEnCours: number;
}