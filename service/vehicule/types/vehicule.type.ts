export interface IVehicule{
    id:string;
    nom:string;
    numero_de_plaque:string;
    annee:number;
    type:string;
    modele:string;
    statut:string;
    siteId?: string | null;
    site?: { id: string; nom: string; code: string } | null;
}

export interface VehiculeStats {
    totalVehicules: number;
    vehiculesActifs: number;
    vehiculesEnMaintenance: number;
    vehiculesInactifs: number;
    vehiculesAvecInterventionsEnCours: number;
    vehiculesSansInterventions: number;
}