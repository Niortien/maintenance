export type CategorieEquipement =
  | 'TASSEUR'
  | 'TRACTEUR'
  | 'AMPLIROLL'
  | 'MOTO_TRICYCLE'
  | 'BP'
  | 'KIA'
  | 'VOITURETTE';

export type StatutEquipement = 'ACTIF' | 'EN_MAINTENANCE' | 'INACTIF';

export interface IEquipement {
  id: string;
  nom: string;
  categorie: CategorieEquipement;
  immatriculation: string | null;
  statut: StatutEquipement;
  image: string | null;
  siteId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEquipementStats {
  total: number;
  byCategorie: Record<string, number>;
  byStatut: Record<string, number>;
}
