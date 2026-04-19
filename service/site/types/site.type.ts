import { ITechnicien } from '@/service/techniciens/types/technicien.type';
import { IVehicule } from '@/service/vehicule/types/vehicule.type';
import { IRapport } from '@/service/rapport/types/rapport.type';

export interface ISite {
  id: string;
  nom: string;
  code: string;
  region?: string | null;
  responsableId?: string | null;
  responsable?: Pick<ITechnicien, 'id' | 'nom' | 'prenom' | 'telephone'> | null;
  _count?: { vehicules: number; techniciens: number; rapports: number };
  createdAt: string;
  updatedAt: string;
}

export interface ISiteDashboard {
  site: Pick<ISite, 'id' | 'nom' | 'code' | 'region'>;
  responsable: ITechnicien | null;
  stats: {
    vehiculesTotal: number;
    vehiculesActifs: number;
    vehiculesEnPanne: number;
    techniciensTotal: number;
    techniciensActifs: number;
    rapportsTotal: number;
  };
  vehicules: IVehicule[];
  techniciens: ITechnicien[];
  derniersRapports: IRapport[];
}
