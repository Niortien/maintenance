'use client';

import { ITechnicien } from "@/service/techniciens/types/technicien.type";
import { IconEditCircle, IconMail, IconTrash, IconUserBolt, IconPhone } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteTechnicien, updateTechnicien } from "@/service/techniciens/technicien.action";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-2xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-600">
            <IconUserBolt className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{technicien.nom} {technicien.prenom}</h3>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mt-1">{technicien.specialite}</p>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold inline-block mt-2 ${getStatusColor(technicien.statut)}`}>
              {technicien.statut}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Modification */}
          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 p-2 rounded-lg transition"
              >
                <IconEditCircle stroke={2} />
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

          {/* Suppression */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 p-2 rounded-lg transition"
              >
                <IconTrash stroke={2} />
              </motion.button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <IconTrash className="text-red-600" />
                  Confirmer la suppression
                </DialogTitle>
              </DialogHeader>
              <p className="text-slate-600 dark:text-slate-400">
                Etes-vous sur de vouloir supprimer <strong>{technicien.nom} {technicien.prenom}</strong> ? Cette action est irreversible.
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
      </div>

      {/* Détails avec Cards */}
      <div className="space-y-3 p-6 border-t border-slate-200 dark:border-slate-700">
        {/* Specialite */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-700/50">
          <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase">Specialite</p>
          <p className="text-sm font-bold text-purple-900 dark:text-purple-100 mt-1">{technicien.specialite}</p>
        </div>

        {/* Email */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700/50 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
            <IconMail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">Email</p>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 break-all">{technicien.email}</p>
          </div>
        </div>

        {/* Téléphone */}
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700/50 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
            <IconPhone className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase">Téléphone</p>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">{technicien.telephone}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TechniciensCards;
