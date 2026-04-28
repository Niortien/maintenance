'use client';

import { ITechnicien } from "@/service/techniciens/types/technicien.type";
import { useRef, useState } from "react";
import toast from 'react-hot-toast';
import { deleteTechnicien, updateTechnicien } from "@/service/techniciens/technicien.action";
import { motion } from "framer-motion";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, Pencil, Trash2, Wrench, ImagePlus, X } from 'lucide-react';
import { BASE_URL } from "@/baseurl/baseurl";

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

interface TechniciensCardsProps {
  technicien: ITechnicien;
  onDelete: (id: string) => void;
  onUpdate: (updated: ITechnicien) => void;
}

const TechniciensCards = ({ technicien, onDelete, onUpdate }: TechniciensCardsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...technicien });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) { toast.error('Format invalide'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Photo trop lourde (max 5 Mo)'); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleDeleteTechnician = async () => {
    setLoading(true);
    try {
      const res = await deleteTechnicien(technicien.id);
      if (res.success) {
        toast.success("Technicien supprimé !");
        onDelete(technicien.id);
        setIsDeleteDialogOpen(false);
      } else toast.error("Erreur: " + res.error);
    } catch {
      toast.error("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTechnician = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('nom', formData.nom);
      fd.append('prenom', formData.prenom);
      fd.append('email', formData.email);
      fd.append('telephone', formData.telephone);
      fd.append('specialite', formData.specialite);
      fd.append('statut', formData.statut);
      if (photoFile) fd.append('photo', photoFile);

      const res = await updateTechnicien(technicien.id, fd);
      if (res.success && "data" in res) {
        toast.success("Technicien mis à jour !");
        onUpdate(res.data as ITechnicien);
        setIsUpdateDialogOpen(false);
        setPhotoFile(null);
        setPhotoPreview(null);
      } else toast.error("Erreur: " + res.error);
    } catch {
      toast.error("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'DISPONIBLE': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'EN_MISSION': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'ABSENT': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'INACTIF': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const initials = `${technicien.nom[0] ?? ''}${technicien.prenom[0] ?? ''}`.toUpperCase();
  const photoUrl = technicien.photo ? `${BASE_URL.replace('/api', '')}/uploads/techniciens/${technicien.photo}` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(5, 150, 105, 0.15)' }}
      transition={{ duration: 0.25 }}
      className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-slate-700 overflow-hidden transition-all duration-300"
    >
      {/* Bandeau vert en haut */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {photoUrl ? (
            <img src={photoUrl} alt={`${technicien.nom} ${technicien.prenom}`} className="h-11 w-11 rounded-full object-cover border-2 border-white/40" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white font-bold text-base">
              {initials}
            </div>
          )}
          <div>
            <p className="font-bold text-white text-base leading-tight">{technicien.nom} {technicien.prenom}</p>
            <p className="text-emerald-200 text-xs mt-0.5 flex items-center gap-1">
              <Wrench className="h-3 w-3" />{technicien.specialite}
            </p>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusColor(technicien.statut)}`}>
          {technicien.statut}
        </span>
      </div>

      {/* Infos contact */}
      <div className="px-5 py-4 space-y-2.5">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Mail className="h-4 w-4 text-emerald-600" />
          <span className="truncate">{technicien.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Phone className="h-4 w-4 text-emerald-600" />
          <span>{technicien.telephone}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 pb-4">
        <Dialog open={isUpdateDialogOpen} onOpenChange={(v) => { setIsUpdateDialogOpen(v); if (!v) { setPhotoFile(null); setPhotoPreview(null); } }}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFormData({ ...technicien })}
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 py-2 rounded-lg transition text-sm font-medium"
            >
              <Pencil className="h-4 w-4" /> Modifier
            </motion.button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le technicien</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Photo */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Photo</label>
                {photoPreview || photoUrl ? (
                  <div className="relative w-20 h-20 mx-auto">
                    <img src={photoPreview ?? photoUrl!} alt="Photo" className="w-20 h-20 rounded-full object-cover border-2 border-emerald-400" />
                    <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 px-4 py-3 text-sm text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition w-full justify-center">
                    <ImagePlus className="h-4 w-4" /> Changer la photo
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handlePhotoChange} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Nom</label>
                  <Input value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Prénom</label>
                  <Input value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Téléphone</label>
                <Input value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Spécialité</label>
                <Select value={formData.specialite} onValueChange={(v) => setFormData({ ...formData, specialite: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SPECIALITES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Statut</label>
                <Select value={formData.statut} onValueChange={(v) => setFormData({ ...formData, statut: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIF">Actif</SelectItem>
                    <SelectItem value="INACTIF">Inactif</SelectItem>
                    <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                    <SelectItem value="EN_MISSION">En mission</SelectItem>
                    <SelectItem value="ABSENT">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleUpdateTechnician} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Confirmer la suppression
              </DialogTitle>
            </DialogHeader>
            <p className="text-slate-600 dark:text-slate-400">
              Êtes-vous sûr de vouloir supprimer <strong>{technicien.nom} {technicien.prenom}</strong> ? Cette action est irréversible.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={handleDeleteTechnician} disabled={loading}>
                {loading ? 'Suppression...' : 'Supprimer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};

export default TechniciensCards;
