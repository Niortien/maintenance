'use client';

import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { createRepartition } from '@/service/repartition/repartition.action';
import { TYPE_CONSOMMABLE_LABELS } from '@/service/repartition/repartition.schema';
import { TypeConsommable } from '@/service/repartition/types/repartition.type';
import { IVehicule } from '@/service/vehicule/types/vehicule.type';

interface Props {
  vehicules: IVehicule[];
  defaultType?: TypeConsommable;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

const emptyForm = (type: TypeConsommable) => ({
  date: todayIso(),
  type,
  designation: '',
  quantite: '',
  prixUnitaireAchat: '',
  prixUnitaireVente: '',
  fournisseur: '',
  vehiculeId: '',
});

const AjouterRepartitionDialog = ({ vehicules, defaultType = 'HUILE_MOTEUR' }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm(defaultType));
  const queryClient = useQueryClient();

  const quantite = Number(form.quantite) || 0;
  const puAchat = Number(form.prixUnitaireAchat) || 0;
  const puVente = Number(form.prixUnitaireVente) || 0;
  const montantAchat = quantite * puAchat;
  const montantVente = quantite * puVente;
  const benefice = montantVente - montantAchat;

  const isPneu = form.type === 'PNEU';

  const resetForm = () => setForm(emptyForm(defaultType));

  const handleSubmit = async () => {
    if (!form.date || !form.quantite || !form.prixUnitaireAchat || !form.prixUnitaireVente) {
      toast.error('Merci de renseigner la date, la quantité et les prix unitaires');
      return;
    }
    setLoading(true);
    const res = await createRepartition({
      date: form.date,
      type: form.type,
      designation: form.designation || undefined,
      quantite,
      prixUnitaireAchat: puAchat,
      prixUnitaireVente: puVente,
      fournisseur: form.fournisseur || undefined,
      vehiculeId: form.vehiculeId || undefined,
    });
    setLoading(false);

    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast.success('Répartition enregistrée');
    queryClient.invalidateQueries({ queryKey: ['repartitions'] });
    queryClient.invalidateQueries({ queryKey: ['repartitions-summary'] });
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
          <PlusCircle className="h-4 w-4" />
          Nouvelle répartition
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enregistrer une répartition journalière</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type de stock</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as TypeConsommable }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_CONSOMMABLE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
          </div>

          {isPneu && (
            <div className="space-y-1.5">
              <Label>Désignation (ex: Pneu 315/80)</Label>
              <Input
                value={form.designation}
                onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                placeholder="Pneu 315/80"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Quantité</Label>
              <Input type="number" min={0} step="any" value={form.quantite} onChange={(e) => setForm((f) => ({ ...f, quantite: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>PU achat</Label>
              <Input type="number" min={0} step="any" value={form.prixUnitaireAchat} onChange={(e) => setForm((f) => ({ ...f, prixUnitaireAchat: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>PU vente</Label>
              <Input type="number" min={0} step="any" value={form.prixUnitaireVente} onChange={(e) => setForm((f) => ({ ...f, prixUnitaireVente: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Engin (facultatif)</Label>
              <Select value={form.vehiculeId || '__none__'} onValueChange={(v) => setForm((f) => ({ ...f, vehiculeId: v === '__none__' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Aucun</SelectItem>
                  {vehicules.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Fournisseur (facultatif)</Label>
              <Input value={form.fournisseur} onChange={(e) => setForm((f) => ({ ...f, fournisseur: e.target.value }))} />
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-slate-500 text-xs uppercase">Montant achat</p>
              <p className="font-semibold text-slate-800">{montantAchat.toLocaleString('fr-FR')} FCFA</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase">Montant vente</p>
              <p className="font-semibold text-slate-800">{montantVente.toLocaleString('fr-FR')} FCFA</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase">Bénéfice</p>
              <p className={`font-semibold ${benefice >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {benefice.toLocaleString('fr-FR')} FCFA
              </p>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AjouterRepartitionDialog;
