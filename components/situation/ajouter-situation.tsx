'use client';

import React, { useRef, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, ImagePlus, X, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { createSituation } from '@/service/situation/situation.action';
import { IEquipement } from '@/service/equipement/types/equipement.type';
import { CATEGORIE_LABELS } from '@/service/equipement/equipement.schema';
import { ICreateBesoin } from '@/service/situation/types/situation.type';

interface Props {
  equipements: IEquipement[];
}

interface ImageEntry {
  file: File;
  preview: string;
}

const emptyBesoin = (): ICreateBesoin => ({ designation: '', quantite: 1, prixUnitaire: 0 });

const AjouterSituationDialog = ({ equipements }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [equipementId, setEquipementId] = useState('');
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [besoins, setBesoins] = useState<ICreateBesoin[]>([emptyBesoin()]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const selectedEquipement = equipements.find((e) => e.id === equipementId);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 10 - images.length;
    const toAdd = files.slice(0, remaining);
    for (const file of toAdd) {
      if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
        toast.error(`Format invalide pour ${file.name}`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} trop lourd (max 5 Mo)`); continue; }
      setImages((prev) => [...prev, { file, preview: URL.createObjectURL(file) }]);
    }
    if (files.length > remaining) toast('Maximum 10 images par situation.', {
      icon: '⚠️',
      style: { background: '#111827', color: '#f9fafb', border: '1px solid #f59e0b', borderRadius: '10px' },
    });
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const resetForm = () => {
    setEquipementId('');
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setBesoins([emptyBesoin()]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateBesoin = (index: number, field: keyof ICreateBesoin, value: string | number) => {
    setBesoins((prev) => prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
  };

  const removeBesoin = (index: number) => {
    setBesoins((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Au moins une image est obligatoire');
      return;
    }
    if (!equipementId) {
      toast.error('Sélectionnez un équipement');
      return;
    }

    const validBesoins = besoins.filter((b) => b.designation.trim() !== '');
    const fd = new FormData(e.currentTarget);
    fd.set('equipementId', equipementId);
    fd.delete('image');
    images.forEach(({ file }) => fd.append('image', file));
    if (validBesoins.length > 0) {
      fd.set('besoinsLogistiques', JSON.stringify(validBesoins));
    }

    setLoading(true);
    try {
      const res = await createSituation(fd);
      if (res.success) {
        toast.success('Situation enregistrée !');
        queryClient.invalidateQueries({ queryKey: ['situations'] });
        resetForm();
        setOpen(false);
      } else {
        toast.error(res.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
          <PlusCircle className="h-4 w-4" />
          Nouvelle situation
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Enregistrer une situation</DialogTitle>
          {selectedEquipement && (
            <p className="text-sm font-bold text-orange-600 mt-1">
              SITUATION {selectedEquipement.nom.toUpperCase()}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">

          {/* Équipement */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Équipement concerné *
            </label>
            <Select value={equipementId} onValueChange={setEquipementId} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un équipement" />
              </SelectTrigger>
              <SelectContent>
                {equipements.map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.nom} — {CATEGORIE_LABELS[eq.categorie] ?? eq.categorie}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Description du problème &amp; diagnostic *
            </label>
            <Textarea
              name="description"
              rows={5}
              required
              placeholder={`Le système hydraulique ne marche pas.\nLe diagnostic montre que la plaquette des circuits d'électricité hydraulique est défaillante.`}
              className="resize-none text-sm"
            />
          </div>

          {/* Images (multiple, max 10) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Photos / Images * <span className="text-slate-400 font-normal">(max 10)</span>
              </label>
              {images.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium"
                >
                  <ImagePlus className="h-3.5 w-3.5" /> Ajouter
                </button>
              )}
            </div>

            {images.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.preview}
                      alt={`Image ${idx + 1}`}
                      className="h-20 w-20 object-cover rounded-xl border-2 border-orange-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 w-20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-300 text-orange-500 hover:bg-orange-50 transition text-xs gap-1"
                  >
                    <ImagePlus className="h-5 w-5" />
                    Ajouter
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 text-sm font-medium transition"
              >
                <ImagePlus className="h-4 w-4" />
                Choisir des images
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={handleImagesChange}
            />
          </div>

          {/* Besoins logistiques */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">Besoins logistiques</label>
              <button
                type="button"
                onClick={() => setBesoins((prev) => [...prev, emptyBesoin()])}
                className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium"
              >
                <Plus className="h-3.5 w-3.5" /> Ajouter
              </button>
            </div>

            <div className="space-y-3">
              {besoins.map((besoin, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-slate-400 mt-2 w-5 shrink-0">{idx + 1}</span>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Désignation (ex: Plaquette hydrauliques)"
                        value={besoin.designation}
                        onChange={(e) => updateBesoin(idx, 'designation', e.target.value)}
                        className="text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Quantité</label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={besoin.quantite}
                            onChange={(e) => updateBesoin(idx, 'quantite', parseFloat(e.target.value) || 0)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Prix unitaire (FCFA)</label>
                          <Input
                            type="number"
                            min="0"
                            value={besoin.prixUnitaire}
                            onChange={(e) => updateBesoin(idx, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      {besoin.quantite > 0 && besoin.prixUnitaire > 0 && (
                        <p className="text-xs text-right text-slate-500 font-medium">
                          Total : <span className="text-orange-600 font-bold">{(besoin.quantite * besoin.prixUnitaire).toLocaleString('fr-FR')} FCFA</span>
                        </p>
                      )}
                    </div>
                    {besoins.length > 1 && (
                      <button type="button" onClick={() => removeBesoin(idx)} className="text-red-400 hover:text-red-600 mt-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total global */}
            {besoins.some((b) => b.quantite > 0 && b.prixUnitaire > 0) && (
              <div className="mt-3 text-right">
                <span className="text-sm font-bold text-slate-700">
                  Total général :{' '}
                  <span className="text-orange-600 text-base">
                    {besoins.reduce((acc, b) => acc + b.quantite * b.prixUnitaire, 0).toLocaleString('fr-FR')} FCFA
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" disabled={loading}>
              {loading ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AjouterSituationDialog;
