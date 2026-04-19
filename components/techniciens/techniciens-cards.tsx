'use client';

import { ITechnicien } from "@/service/techniciens/types/technicien.type";
import { useState } from "react";
import { toast } from "sonner";
import { deleteTechnicien, updateTechnicien } from "@/service/techniciens/technicien.action";
import { motion } from "framer-motion";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Pencil, Trash2, Wrench } from 'lucide-react';

interface TechniciensCardsProps {
  technicien: ITechnicien;
  onDelete: (id: string) => void;
  onUpdate: (updated: ITechnicien) => void;
}

const TechniciensCards = ({ technicien, onDelete, onUpdate }: TechniciensCardsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ITechnicien>({ ...technicien });

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
      const res = await updateTechnicien(technicien.id, formData);
      if (res.success && "data" in res) {
        toast.success("Technicien mis à jour !");
        onUpdate(res.data as ITechnicien);
        setIsUpdateDialogOpen(false);
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
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white font-bold text-base">
            {initials}
          </div>
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
          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 py-2 rounded-lg transition text-sm font-medium"
              >
                <Pencil className="h-4 w-4" /> Modifier
              </motion.button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le technicien</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nom</label>
                  <Input
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Prénom</label>
                  <Input
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Téléphone</label>
                  <Input
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Specialite</label>
                  <Input
                    value={formData.specialite}
                    onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleUpdateTechnician} disabled={loading}>
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
