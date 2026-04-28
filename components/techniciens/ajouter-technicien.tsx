"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createTechnicien } from "@/service/techniciens/technicien.action";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "@/service/auth/auth.action";
import toast from 'react-hot-toast';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PlusCircle, ImagePlus, X, UserCircle } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const SPECIALITES = [
  { value: "MECANIQUE_GENERALE", label: "Mécanique générale" },
  { value: "ELECTRICITE_AUTOMOBILE", label: "Électricité automobile" },
  { value: "PNEUMATIQUE", label: "Pneumatique" },
  { value: "DIAGNOSTIC_ELECTRONIQUE", label: "Diagnostic électronique" },
  { value: "CLIMATISATION", label: "Climatisation" },
  { value: "SYSTEME_FREINAGE", label: "Freinage" },
  { value: "TRANSMISSION", label: "Transmission" },
  { value: "HYDRAULIQUE", label: "Hydraulique" },
  { value: "CARROSSERIE", label: "Carrosserie" },
  { value: "PEINTURE", label: "Peinture" },
];

const AjouterTechnicienDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [specialite, setSpecialite] = useState('');
  const [statut, setStatut] = useState('ACTIF');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
  const siteId = profileData?.success ? profileData.data?.site?.id : undefined;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      toast.error('Format invalide. Formats acceptés : JPEG, PNG, WebP, GIF');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) { toast.error('Photo trop lourde (max 5 Mo)'); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setSpecialite('');
    setStatut('ACTIF');
    if (fileInputRef.current) fileInputRef.current.value = '';
    formRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('specialite', specialite);
    fd.set('statut', statut);
    if (photoFile) fd.set('photo', photoFile);

    if (!specialite) { toast.error('Veuillez sélectionner une spécialité'); return; }
    if (!siteId) { toast.error('Impossible de déterminer le site. Rechargez la page.'); return; }
    fd.set('siteId', siteId);

    setLoading(true);
    try {
      const res = await createTechnicien(fd);
      if (res.success) {
        toast.success('Technicien créé avec succès !');
        queryClient.invalidateQueries({ queryKey: ['techniciens'] });
        resetForm();
        setOpen(false);
      } else {
        toast.error(typeof res.error === 'string' ? res.error : 'Erreur lors de la création');
      }
    } catch {
      toast.error('Erreur inattendue lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Gestion des techniciens</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Gérez les techniciens de votre site</p>
      </div>
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
        <DialogTrigger asChild>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <PlusCircle className="h-4 w-4" />
            Ajouter un technicien
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-emerald-600" />
              Nouveau technicien
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau technicien.
            </DialogDescription>
          </DialogHeader>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {/* Photo */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Photo (optionnel)
              </label>
              {photoPreview ? (
                <div className="relative w-24 h-24 mx-auto">
                  <img src={photoPreview} alt="Aperçu" className="w-24 h-24 rounded-full object-cover border-2 border-emerald-400" />
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 px-4 py-3 text-sm text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition w-full justify-center"
                >
                  <ImagePlus className="h-4 w-4" />
                  Choisir une photo
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Nom / Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Nom *</label>
                <Input name="nom" required placeholder="Konan" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Prénom *</label>
                <Input name="prenom" required placeholder="Eric" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email *</label>
              <Input name="email" type="email" required placeholder="technicien@sate.ci" />
            </div>

            {/* Téléphone */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Téléphone *</label>
              <Input name="telephone" required placeholder="+225 07 00 00 00" />
            </div>

            {/* Spécialité */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Spécialité *</label>
              <Select value={specialite} onValueChange={setSpecialite}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une spécialité" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALITES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Statut */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Statut</label>
              <Select value={statut} onValueChange={setStatut}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIF">Actif</SelectItem>
                  <SelectItem value="INACTIF">Inactif</SelectItem>
                  <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                  <SelectItem value="EN_MISSION">En mission</SelectItem>
                  <SelectItem value="ABSENT">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {loading ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AjouterTechnicienDialog;
