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

export interface IAdminAuthResponse {
  access_token: string;
  admin: { id: number; email: string };
}

export interface IProfileResponse extends IResponsableSite {
  site: ISiteAuth & {
    vehicules: { id: string; nom: string; numero_de_plaque: string; statut: string; type: string }[];
    techniciens: { id: string; nom: string; prenom: string; statut: string; specialite: string }[];
    _count: { rapports: number; vehicules: number; techniciens: number };
  };
}

// ─── Véhicule (liste du site) ─────────────────────────────────────────────────
export interface IVehiculeMe {
  id: string;
  nom: string;
  numero_de_plaque: string;
  annee: number;
  type: string;
  modele: string;
  statut: 'ACTIF' | 'EN_MAINTENANCE' | 'INACTIF';
  siteId: string | null;
  createdAt: string;
}

// ─── Technicien (avec interventions du jour) ─────────────────────────────────
export interface ITechnicienMe {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut: 'ACTIF' | 'INACTIF';
  specialite: string;
  interventions: {
    id: string;
    description: string;
    designation: string;
    statut: string;
    vehicule: { nom: string; numero_de_plaque: string };
  }[];
  _count: { interventions: number };
}

// ─── Intervention du site ─────────────────────────────────────────────────────
export interface IInterventionMe {
  id: string;
  date: string;
  description: string;
  designation: string;
  statut: string;
  priorite: string;
  vehicule: { id: string; nom: string; numero_de_plaque: string };
  technicien: { id: string; nom: string; prenom: string; specialite: string };
}

// ─── Rapport (du site du responsable) ────────────────────────────────────────
export interface IRapportMe {
  id: string;
  date: string;
  siteId: string;
  lignes: ILigneRapportMe[];
}

export interface ILigneRapportMe {
  id: string;
  codeVehicule: string;
  immatriculation: string | null;
  categorie: string;
  statut: 'OPERATIONNEL' | 'EN_PANNE' | 'ACCIDENTE' | 'EN_ATTENTE';
  typesPannes: string[];
  description: string | null;
}

// ─── Admin: site avec stats ───────────────────────────────────────────────────
export interface IAdminSite {
  id: string;
  nom: string;
  code: string;
  region: string | null;
  couleur: string | null;
  _count: { vehicules: number; techniciens: number; rapports: number };
}

// ─── Admin: responsable de site ──────────────────────────────────────────────
export interface IAdminResponsable {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  createdAt: string;
  site: { id: string; nom: string; code: string; couleur: string | null };
}

// ─── Admin: rapport complet ───────────────────────────────────────────────────
export interface IAdminRapport {
  id: string;
  date: string;
  siteId: string;
  site: { id: string; nom: string; code: string; region: string | null; couleur: string | null };
  lignes: ILigneRapportMe[];
}

