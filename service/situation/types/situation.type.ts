import { IEquipement } from '@/service/equipement/types/equipement.type';

export type StatutSituation = 'EN_ATTENTE' | 'EN_COURS' | 'VALIDEE' | 'TERMINEE';

export interface ISituationImage {
  id: string;
  url: string;
  situationId: string;
  createdAt: string;
}

export interface IBesoinLogistique {
  id: string;
  designation: string;
  quantite: number;
  prixUnitaire: number;
  situationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISituation {
  id: string;
  nom: string;
  description: string;
  statut: StatutSituation;
  /** @deprecated use images[] */
  image?: string;
  images: ISituationImage[];
  equipementId: string;
  siteId: string;
  responsableId: string;
  besoins: IBesoinLogistique[];
  equipement: Pick<IEquipement, 'id' | 'nom' | 'categorie'>;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateBesoin {
  designation: string;
  quantite: number;
  prixUnitaire: number;
}
