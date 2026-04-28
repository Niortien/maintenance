import { ISituation } from '@/service/situation/types/situation.type';

export interface INotification {
  id: string;
  message: string;
  lu: boolean;
  situationId: string;
  situation?: Pick<ISituation, 'id' | 'nom' | 'statut' | 'createdAt'>;
  createdAt: string;
}

export interface INotificationCount {
  count: number;
}
