'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, ImagePlus, X, Tag, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { IEquipement } from '@/service/equipement/types/equipement.type';
import { deleteEquipement, updateEquipement } from '@/service/equipement/equipement.action';
import {
  CATEGORIES_EQUIPEMENT,
  CATEGORIE_LABELS,
  STATUTS_EQUIPEMENT,
  CATEGORIES_IMMAT_REQUIRED,
} from '@/service/equipement/equipement.schema';
import { BASE_URL } from '@/baseurl/baseurl';

interface Props {
  equipement: IEquipement;
  onDelete: (id: string) => void;
  onUpdate: (updated: IEquipement) => void;
}

const CATEGORIE_GRADIENT: Record<string, string> = {
  TASSEUR:      'from-orange-600 to-amber-500',
  TRACTEUR:     'from-green-700 to-emerald-600',
  AMPLIROLL:    'from-blue-700 to-blue-500',
  MOTO_TRICYCLE:'from-purple-700 to-violet-500',
  BP:           'from-red-700 to-rose-500',
  KIA:          'from-teal-700 to-cyan-500',
  VOITURETTE:   'from-slate-600 to-slate-500',
};

const getStatutConf = (statut: string) => {
  switch (statut) {
    case 'ACTIF': return { label: 'Actif', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' };
    case 'EN_MAINTENANCE': return { label: 'En maintenance', cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' };
    default: return { label: 'Inactif', cls: 'bg-red-100 text-red-600', dot: 'bg-red-500' };
  }
};

const EquipementCard = ({ equipement, onDelete, onUpdate }: Props) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editCategorie, setEditCategorie] = useState(equipement.categorie);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statConf = getStatutConf(equipement.statut);
  const gradient = CATEGORIE_GRADIENT[equipement.categorie] ?? 'from-slate-600 to-slate-500';
  const immatRequired = (CATEGORIES_IMMAT_REQUIRED as readonly string[]).includes(editCategorie);
  const imageUrl = equipement.image ? `${BASE_URL}/${equipement.image}` : null;

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

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteEquipement(equipement.id);
      if (res.success) {
        toast.success('Équipement supprimé');
        onDelete(equipement.id);
        setDeleteOpen(false);
      } else toast.error(res.error);
    } finally { setLoading(false); }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (imageFile) fd.set('image', imageFile);
    setLoading(true);
    try {
      const res = await updateEquipement(equipement.id, fd);
      if (res.success) {
        toast.success('Équipement mis à jour');
        onUpdate(res.data);
        setEditOpen(false);
        setImageFile(null);
        setImagePreview(null);
      } else toast.error(res.error);
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradient} px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={equipement.nom} className="h-11 w-11 rounded-xl object-cover border-2 border-white/30" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white font-bold text-lg">
              {equipement.nom.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-bold text-white text-base">{equipement.nom}</p>
            <p className="text-white/70 text-xs">{CATEGORIE_LABELS[equipement.categorie]}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statConf.cls}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statConf.dot}`} />
          {statConf.label}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Tag className="h-4 w-4 text-teal-600 flex-shrink-0" />
          <span className="font-medium">{CATEGORIE_LABELS[equipement.categorie]}</span>
        </div>
        {equipement.immatriculation && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Hash className="h-4 w-4 text-teal-600 flex-shrink-0" />
            <span className="font-mono font-semibold">{equipement.immatriculation}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 pb-4">
        {/* Edit */}
        <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) { setImageFile(null); setImagePreview(null); setEditCategorie(equipement.categorie); } }}>
          <DialogTrigger asChild>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 py-2 rounded-lg text-sm font-medium transition">
              <Pencil className="h-4 w-4" /> Modifier
            </motion.button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Modifier l&apos;équipement</DialogTitle></DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Catégorie</label>
                <Select name="categorie" value={editCategorie} onValueChange={(v) => setEditCategorie(v as typeof editCategorie)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES_EQUIPEMENT.map((c) => (
                      <SelectItem key={c} value={c}>{CATEGORIE_LABELS[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Nom</label>
                <Input name="nom" defaultValue={equipement.nom} />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">
                  Immatriculation {immatRequired ? '*' : '(optionnel)'}
                </label>
                <Input name="immatriculation" defaultValue={equipement.immatriculation ?? ''} required={immatRequired} />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Statut</label>
                <Select name="statut" defaultValue={equipement.statut}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUTS_EQUIPEMENT.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === 'ACTIF' ? 'Actif' : s === 'EN_MAINTENANCE' ? 'En maintenance' : 'Inactif'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Image</label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="preview" className="h-24 w-24 rounded-lg object-cover border" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="h-3 w-3" /></button>
                  </div>
                ) : imageUrl ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="actuelle" className="h-16 w-16 rounded-lg object-cover border" />
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-teal-600 underline">Changer</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 border-2 border-dashed border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-500 hover:border-teal-400 transition w-full justify-center">
                    <ImagePlus className="h-5 w-5" /> Choisir une image
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition">
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Supprimer l&apos;équipement</DialogTitle></DialogHeader>
            <p className="text-sm text-slate-600 mt-2">
              Êtes-vous sûr de vouloir supprimer <strong>{equipement.nom}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteOpen(false)} disabled={loading}>Annuler</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={loading}>
                {loading ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};

export default EquipementCard;
