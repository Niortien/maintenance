export type CategorieVehicule =
  | 'TASSEUR'
  | 'BP'
  | 'AMPLIROLL'
  | 'TRACTEUR'
  | 'KIA'
  | 'VOITURETTE'
  | 'PC'
  | 'MOTO_TRICYCLE'
  | 'KB';

export type StatutVehiculeRapport = 'OPERATIONNEL' | 'EN_PANNE' | 'ACCIDENTE' | 'EN_ATTENTE';

export type TypePanne =
  | 'MECANIQUE'
  | 'AIR'
  | 'ELECTRICITE'
  | 'SOUDURE'
  | 'HYDRAULIQUE'
  | 'PNEUMATIQUE'
  | 'POMPE_INJECTION'
  | 'PNEU'
  | 'CARROSSERIE'
  | 'AUTRE';

export interface ILigneRapport {
  id: string;
  rapportId: string;
  codeVehicule: string;
  immatriculation?: string | null;
  categorie: CategorieVehicule;
  statut: StatutVehiculeRapport;
  typesPannes: TypePanne[];
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IRapport {
  id: string;
  date: string;
  siteId: string;
  site: { id: string; nom: string; code: string; region?: string | null };
  lignes: ILigneRapport[];
  createdAt: string;
  updatedAt: string;
}

export interface RecapCategorie {
  categorie: CategorieVehicule;
  operationnels: number;
  total: number;
  resume: string;
}

export interface RapportRecap {
  date: string;
  site: { id: string; nom: string; code: string };
  recap: RecapCategorie[];
  pannes: ILigneRapport[];
}

export interface RapportStats {
  totalRapports: number;
  totalLignes: number;
  operationnels: number;
  enPanne: number;
  accidentes: number;
}
