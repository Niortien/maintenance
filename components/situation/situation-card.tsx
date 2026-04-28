'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Plus, ImagePlus, X, AlertTriangle, Eye, Package, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { ISituation, ICreateBesoin, StatutSituation } from '@/service/situation/types/situation.type';
import { deleteSituation, updateSituation, changeSituationStatut } from '@/service/situation/situation.action';
import { BASE_URL } from '@/baseurl/baseurl';

interface Props {
  situation: ISituation;
  onDelete: (id: string) => void;
  onUpdate: (updated: ISituation) => void;
}

const emptyBesoin = (): ICreateBesoin => ({ designation: '', quantite: 1, prixUnitaire: 0 });

const STATUT_LABELS: Record<StatutSituation, string> = {
  EN_ATTENTE: 'En attente',
  EN_COURS: 'En cours',
  VALIDEE: 'Validée',
  TERMINEE: 'Terminée',
};

const STATUT_COLORS: Record<StatutSituation, string> = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  EN_COURS: 'bg-blue-100 text-blue-700 border-blue-200',
  VALIDEE: 'bg-green-100 text-green-700 border-green-200',
  TERMINEE: 'bg-slate-100 text-slate-600 border-slate-200',
};

const SituationCard = ({ situation, onDelete, onUpdate }: Props) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [statutOpen, setStatutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [besoins, setBesoins] = useState<ICreateBesoin[]>(() =>
    situation.besoins.length > 0
      ? situation.besoins.map((b) => ({ designation: b.designation, quantite: b.quantite, prixUnitaire: b.prixUnitaire }))
      : [emptyBesoin()],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allImages = situation.images?.length > 0
    ? situation.images.map((img) => `${BASE_URL}/${img.url}`)
    : situation.image ? [`${BASE_URL}/${situation.image}`] : [];

  const coverImage = allImages[0] ?? null;
  const totalGeneral = situation.besoins.reduce((acc, b) => acc + b.quantite * b.prixUnitaire, 0);
  const statut: StatutSituation = situation.statut ?? 'EN_ATTENTE';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      toast.error('Format invalide. Formats acceptés : JPEG, PNG, WebP, GIF');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image trop lourde (max 5 Mo)'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChangeStatut = async (newStatut: Extract<StatutSituation, 'EN_COURS' | 'TERMINEE'>) => {
    setLoading(true);
    try {
      const res = await changeSituationStatut(situation.id, newStatut);
      if (res.success) {
        toast.success(`Statut mis à jour : ${STATUT_LABELS[newStatut]}`);
        onUpdate(res.data);
        setStatutOpen(false);
      } else toast.error(res.error);
    } finally { setLoading(false); }
  };

  const updateBesoin = (index: number, field: keyof ICreateBesoin, value: string | number) => {
    setBesoins((prev) => prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteSituation(situation.id);
      if (res.success) {
        toast.success('Situation supprimée');
        onDelete(situation.id);
        setDeleteOpen(false);
      } else toast.error(res.error);
    } finally { setLoading(false); }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (imageFile) fd.set('image', imageFile);
    const validBesoins = besoins.filter((b) => b.designation.trim() !== '');
    if (validBesoins.length > 0) {
      fd.set('besoinsLogistiques', JSON.stringify(validBesoins));
    }
    setLoading(true);
    try {
      const res = await updateSituation(situation.id, fd);
      if (res.success) {
        toast.success('Situation mise à jour');
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
      {/* Image + Header */}
      <div className="relative">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={situation.nom}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-linear-to-br from-orange-600 to-amber-500 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-white/60" />
          </div>
        )}
        {/* Statut badge */}
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUT_COLORS[statut]}`}>
          {STATUT_LABELS[statut]}
        </span>
        {/* Image count */}
        {allImages.length > 1 && (
          <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">
            {allImages.length} photos
          </span>
        )}
        {/* Badge titre */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent px-4 pt-6 pb-3">
          <p className="font-extrabold text-white text-sm tracking-wider">{situation.nom}</p>
          <p className="text-white/70 text-xs">{situation.equipement.categorie}</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        {/* Description résumée */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
          {situation.description}
        </p>

        {/* Résumé besoins */}
        {situation.besoins.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Package className="h-3.5 w-3.5 text-orange-500 shrink-0" />
            <span>{situation.besoins.length} besoin{situation.besoins.length > 1 ? 's' : ''} logistique{situation.besoins.length > 1 ? 's' : ''}</span>
            <span className="ml-auto font-bold text-orange-600">
              {totalGeneral.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          {new Date(situation.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4">
        {/* Detail */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogTrigger asChild>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 py-2 rounded-lg text-sm font-medium transition">
              <Eye className="h-4 w-4" /> Voir
            </motion.button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-orange-600 font-extrabold tracking-wider">{situation.nom}</DialogTitle>
              <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full border w-fit ${STATUT_COLORS[statut]}`}>
                {STATUT_LABELS[statut]}
              </span>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              {/* Image gallery */}
              {allImages.length > 0 && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={allImages[imgIdx]} alt={`Photo ${imgIdx + 1}`} className="w-full rounded-xl object-cover max-h-60" />
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIdx((i) => (i - 1 + allImages.length) % allImages.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 hover:bg-black/60"
                      ><ChevronLeft className="h-4 w-4" /></button>
                      <button
                        onClick={() => setImgIdx((i) => (i + 1) % allImages.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 hover:bg-black/60"
                      ><ChevronRight className="h-4 w-4" /></button>
                      <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                        {imgIdx + 1} / {allImages.length}
                      </span>
                    </>
                  )}
                </div>
              )}
              <div>
                <p className="text-xs font-bold uppercase text-slate-400 mb-1">Description / Diagnostic</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{situation.description}</p>
              </div>
              {situation.besoins.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400 mb-2">Besoins logistiques</p>
                  <div className="space-y-2">
                    {situation.besoins.map((b, idx) => (
                      <div key={b.id} className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2">
                        <span className="text-sm text-slate-700">
                          <span className="font-semibold text-orange-600 mr-1">{idx + 1}.</span>
                          {b.quantite > 1 ? `${b.quantite}×` : ''} {b.designation}
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {(b.quantite * b.prixUnitaire).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-orange-200">
                      <span className="text-sm font-bold text-slate-700">Total</span>
                      <span className="text-base font-extrabold text-orange-600">
                        {totalGeneral.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Changer statut (responsable: EN_COURS | TERMINEE) */}
        {statut !== 'VALIDEE' && (
          <Dialog open={statutOpen} onOpenChange={setStatutOpen}>
            <DialogTrigger asChild>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 px-3 py-2 rounded-lg text-xs font-medium transition">
                Statut
              </motion.button>
            </DialogTrigger>
            <DialogContent className="max-w-xs">
              <DialogHeader><DialogTitle>Changer le statut</DialogTitle></DialogHeader>
              <p className="text-xs text-slate-500 mb-3">Statut actuel : <strong>{STATUT_LABELS[statut]}</strong></p>
              <div className="space-y-2">
                {statut !== 'EN_COURS' && statut !== 'TERMINEE' && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}
                    onClick={() => handleChangeStatut('EN_COURS')}>
                    Passer en cours de traitement
                  </Button>
                )}
                {statut !== 'TERMINEE' && (
                  <Button className="w-full bg-slate-600 hover:bg-slate-700 text-white" disabled={loading}
                    onClick={() => handleChangeStatut('TERMINEE')}>
                    Marquer comme terminée
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}


        <Dialog open={editOpen} onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) {
            setImageFile(null);
            setImagePreview(null);
            setBesoins(situation.besoins.length > 0
              ? situation.besoins.map((b) => ({ designation: b.designation, quantite: b.quantite, prixUnitaire: b.prixUnitaire }))
              : [emptyBesoin()]);
          }
        }}>
          <DialogTrigger asChild>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 py-2 rounded-lg text-sm font-medium transition">
              <Pencil className="h-4 w-4" /> Modifier
            </motion.button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier la situation</DialogTitle>
              <p className="text-sm font-bold text-orange-600">{situation.nom}</p>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Description</label>
                <Textarea name="description" rows={5} defaultValue={situation.description} className="resize-none text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Nouvelle image (optionnel)</label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="preview" className="h-28 w-auto rounded-xl object-cover border" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 text-sm font-medium transition">
                    <ImagePlus className="h-4 w-4" /> Choisir une image
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageChange} />
              </div>

              {/* Besoins */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">Besoins logistiques</label>
                  <button type="button" onClick={() => setBesoins((prev) => [...prev, emptyBesoin()])}
                    className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium">
                    <Plus className="h-3.5 w-3.5" /> Ajouter
                  </button>
                </div>
                <div className="space-y-3">
                  {besoins.map((besoin, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-slate-400 mt-2 w-5 shrink-0">{idx + 1}</span>
                        <div className="flex-1 space-y-2">
                          <Input placeholder="Désignation" value={besoin.designation}
                            onChange={(e) => updateBesoin(idx, 'designation', e.target.value)} className="text-sm" />
                          <div className="grid grid-cols-2 gap-2">
                            <Input type="number" min="0" step="0.01" value={besoin.quantite}
                              onChange={(e) => updateBesoin(idx, 'quantite', parseFloat(e.target.value) || 0)} className="text-sm" placeholder="Qté" />
                            <Input type="number" min="0" value={besoin.prixUnitaire}
                              onChange={(e) => updateBesoin(idx, 'prixUnitaire', parseFloat(e.target.value) || 0)} className="text-sm" placeholder="Prix FCFA" />
                          </div>
                        </div>
                        {besoins.length > 1 && (
                          <button type="button" onClick={() => setBesoins((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-red-400 hover:text-red-600 mt-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setEditOpen(false)} disabled={loading}>Annuler</Button>
                <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" disabled={loading}>
                  {loading ? 'Enregistrement…' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition">
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Supprimer la situation</DialogTitle></DialogHeader>
            <p className="text-sm text-slate-600 mt-2">
              Voulez-vous vraiment supprimer <strong>{situation.nom}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteOpen(false)} disabled={loading}>Annuler</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete} disabled={loading}>
                {loading ? 'Suppression…' : 'Supprimer'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};

export default SituationCard;
