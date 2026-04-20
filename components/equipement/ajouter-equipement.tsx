'use client';

import React, { useRef, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { createEquipement } from '@/service/equipement/equipement.action';
import {
  CATEGORIES_EQUIPEMENT,
  CATEGORIE_LABELS,
  STATUTS_EQUIPEMENT,
  CATEGORIES_IMMAT_REQUIRED,
} from '@/service/equipement/equipement.schema';
import { BASE_URL } from '@/baseurl/baseurl';

const AjouterEquipementDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categorie, setCategorie] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const immatRequired = (CATEGORIES_IMMAT_REQUIRED as readonly string[]).includes(categorie);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      toast.error('Format invalide. Formats acceptés : JPEG, PNG, WebP, GIF');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image trop lourde (max 5 Mo)'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setCategorie('');
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (imageFile) fd.set('image', imageFile);

    setLoading(true);
    try {
      const res = await createEquipement(fd);
      if (res.success) {
        toast.success('Équipement ajouté !');
        queryClient.invalidateQueries({ queryKey: ['equipements'] });
        resetForm();
        form.reset();
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
        <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
          <PlusCircle className="h-4 w-4" />
          Ajouter un équipement
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvel équipement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Catégorie */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Catégorie *</label>
            <Select name="categorie" value={categorie} onValueChange={setCategorie} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES_EQUIPEMENT.map((c) => (
                  <SelectItem key={c} value={c}>{CATEGORIE_LABELS[c]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categorie === 'TASSEUR' && (
              <p className="text-xs text-amber-600 mt-1">Le nom doit commencer par T (ex: T50)</p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Nom *</label>
            <Input name="nom" placeholder={
              categorie === 'TASSEUR' ? 'ex: T50' :
              categorie === 'TRACTEUR' ? 'ex: TRACT01' :
              categorie === 'AMPLIROLL' ? 'ex: A47' :
              categorie === 'KIA' ? 'ex: KIA01' :
              categorie === 'BP' ? 'ex: BP01' : 'Nom de l\'équipement'
            } required />
          </div>

          {/* Immatriculation */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">
              Immatriculation {immatRequired ? '*' : '(optionnel)'}
            </label>
            <Input
              name="immatriculation"
              placeholder="ex: AB-123-CD"
              required={immatRequired}
            />
          </div>

          {/* Statut */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Statut</label>
            <Select name="statut" defaultValue="ACTIF">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUTS_EQUIPEMENT.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === 'ACTIF' ? 'Actif' : s === 'EN_MAINTENANCE' ? 'En maintenance' : 'Inactif'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Image (optionnel)</label>
            {imagePreview ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="preview" className="h-24 w-24 rounded-lg object-cover border" />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border-2 border-dashed border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-500 hover:border-teal-400 hover:text-teal-600 transition w-full justify-center">
                <ImagePlus className="h-5 w-5" />
                Choisir une image
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <Button type="submit" disabled={loading || !categorie} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            {loading ? 'Enregistrement...' : 'Ajouter'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AjouterEquipementDialog;
