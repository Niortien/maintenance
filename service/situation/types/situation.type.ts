import { IEquipement } from '@/service/equipement/types/equipement.type';

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
  image: string;
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
