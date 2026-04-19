'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FileText, Calendar, MapPin, Trash2, Eye, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { IRapport, ILigneRapport } from '@/service/rapport/types/rapport.type';
import { deleteRapport } from '@/service/rapport/rapport.action';

const RapportPDFButton = dynamic(() => import('@/components/pdf/rapport-pdf-button'), { ssr: false, loading: () => null });

interface RapportCardProps {
  rapport: IRapport;
  onDelete: (id: string) => void;
}

const statutConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  OPERATIONNEL: { label: 'Opérationnel', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="h-3 w-3" /> },
  EN_PANNE: { label: 'En panne', color: 'bg-red-100 text-red-700', icon: <XCircle className="h-3 w-3" /> },
  ACCIDENTE: { label: 'Accidenté', color: 'bg-orange-100 text-orange-700', icon: <AlertCircle className="h-3 w-3" /> },
  EN_ATTENTE: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="h-3 w-3" /> },
};

const LigneBadge = ({ ligne }: { ligne: ILigneRapport }) => {
  const cfg = statutConfig[ligne.statut] ?? statutConfig.EN_ATTENTE;
  return (
    <div className="flex items-center justify-between py-1.5 border-b last:border-0 border-slate-100">
      <div>
        <span className="font-mono text-sm font-semibold">{ligne.codeVehicule}</span>
        {ligne.immatriculation && <span className="text-xs text-slate-400 ml-1">({ligne.immatriculation})</span>}
        <span className="text-xs text-slate-500 ml-2">{ligne.categorie}</span>
      </div>
      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
        {cfg.icon}{cfg.label}
      </span>
    </div>
  );
};

const RapportCard = ({ rapport, onDelete }: RapportCardProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const operationnels = rapport.lignes.filter((l) => l.statut === 'OPERATIONNEL').length;
  const pannes = rapport.lignes.filter((l) => l.statut !== 'OPERATIONNEL').length;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteRapport(rapport.id);
      if (res.success) {
        toast.success('Rapport supprimé !');
        onDelete(rapport.id);
        queryClient.invalidateQueries({ queryKey: ['rapports', 'list'] });
        setIsDeleteOpen(false);
      } else toast.error('Erreur: ' + res.error);
    } catch { toast.error('Erreur inattendue'); }
    finally { setLoading(false); }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
            <FileText className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              <span className="font-medium text-slate-700 dark:text-slate-300">{rapport.site.nom}</span>
              <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{rapport.site.code}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <Calendar className="h-3 w-3" />
              {formatDate(rapport.date)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center rounded-xl bg-slate-50 dark:bg-slate-700/50 py-2">
          <div className="text-lg font-bold text-slate-800 dark:text-white">{rapport.lignes.length}</div>
          <div className="text-xs text-slate-500">Total</div>
        </div>
        <div className="text-center rounded-xl bg-green-50 py-2">
          <div className="text-lg font-bold text-green-600">{operationnels}</div>
          <div className="text-xs text-green-500">OK</div>
        </div>
        <div className="text-center rounded-xl bg-red-50 py-2">
          <div className="text-lg font-bold text-red-600">{pannes}</div>
          <div className="text-xs text-red-500">Pannes</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {/* PDF Export */}
        <RapportPDFButton rapport={rapport} />

        {/* Detail */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex-1 gap-1">
              <Eye className="h-3 w-3" /> Détails
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Rapport — {rapport.site.nom} ({rapport.site.code})</DialogTitle>
              <p className="text-sm text-slate-500">{formatDate(rapport.date)}</p>
            </DialogHeader>
            <div className="space-y-1 mt-2">
              {rapport.lignes.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">Aucune ligne dans ce rapport</p>
              )}
              {rapport.lignes.map((l) => <LigneBadge key={l.id} ligne={l} />)}
            </div>
            {rapport.lignes.some((l) => l.statut !== 'OPERATIONNEL') && (
              <div className="mt-4 p-3 bg-red-50 rounded-xl">
                <p className="text-sm font-semibold text-red-700 mb-2">Détail des pannes</p>
                {rapport.lignes.filter((l) => l.statut !== 'OPERATIONNEL').map((l) => (
                  <div key={l.id} className="text-xs text-red-600 mb-1">
                    <strong>{l.codeVehicule}</strong>
                    {l.typesPannes.length > 0 && ` — ${l.typesPannes.join(', ')}`}
                    {l.description && ` : ${l.description}`}
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex-1 gap-1 text-red-600 hover:bg-red-50">
              <Trash2 className="h-3 w-3" /> Supprimer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Supprimer le rapport</DialogTitle></DialogHeader>
            <p className="text-sm text-slate-600">Confirmer la suppression du rapport du <strong>{formatDate(rapport.date)}</strong> pour <strong>{rapport.site.nom}</strong> ?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? 'Suppression...' : 'Supprimer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};

export default RapportCard;
