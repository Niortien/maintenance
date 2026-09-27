export type TypeConsommable = 'HUILE_MOTEUR' | 'HUILE_VERIN' | 'PNEU' | 'BATTERIE';

export interface IRepartition {
  id: string;
  date: string;
  type: TypeConsommable;
  designation?: string | null;
  quantite: number;
  prixUnitaireAchat: number;
  montantAchat: number;
  prixUnitaireVente: number;
  montantVente: number;
  benefice: number;
  fournisseur?: string | null;
  siteId: string;
  site?: { id: string; nom: string; code: string };
  vehiculeId?: string | null;
  vehicule?: { id: string; nom: string; numero_de_plaque: string } | null;
  responsableId?: string | null;
  responsable?: { id: string; nom: string; prenom: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface IRepartitionTypeSummary {
  type: TypeConsommable;
  nombreLignes: number;
  quantiteTotale: number;
  montantAchatTotal: number;
  montantVenteTotal: number;
  beneficeTotal: number;
}

export interface IRepartitionSummary {
  parType: IRepartitionTypeSummary[];
  global: {
    montantAchatTotal: number;
    montantVenteTotal: number;
    beneficeTotal: number;
  };
}

export interface RepartitionQuery {
  type?: TypeConsommable;
  from?: string;
  to?: string;
  vehiculeId?: string;
}
