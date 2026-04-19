export interface IResponsableSite {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string | null;
  site: ISiteAuth;
  createdAt: string;
  updatedAt: string;
}

export interface ISiteAuth {
  id: string;
  nom: string;
  code: string;
  region?: string | null;
  couleur?: string | null;
}

export interface ISiteStats {
  totalVehicules: number;
  vehiculesActifs: number;
  vehiculesEnMaintenance: number;
  totalTechniciens: number;
  totalRapports: number;
  derniersRapports: {
    id: string;
    date: string;
    total: number;
    ops: number;
    pannes: number;
  }[];
}

export interface IAuthResponse {
  access_token: string;
  responsable: IResponsableSite;
}

export interface IProfileResponse extends IResponsableSite {
  site: ISiteAuth & {
    vehicules: { id: string; nom: string; numero_de_plaque: string; statut: string; type: string }[];
    techniciens: { id: string; nom: string; prenom: string; statut: string; specialite: string }[];
    _count: { rapports: number; vehicules: number; techniciens: number };
  };
}
