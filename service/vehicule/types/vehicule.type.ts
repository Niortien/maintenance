export interface IVehicule{
    id:string;
    nom:string;
    numero_de_plaque:string;
    annee:number;
    type:string;
    modele:string;
    statut:string
}

export interface VehiculeStats {
    totalVehicules: number;
    vehiculesActifs: number;
    vehiculesEnMaintenance: number;
    vehiculesInactifs: number;
    vehiculesAvecInterventionsEnCours: number;
    vehiculesSansInterventions: number;
}