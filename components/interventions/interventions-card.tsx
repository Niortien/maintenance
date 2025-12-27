'use client';

import { Button } from "@/components/ui/button";
import { deleteIntervention, updateIntervention } from "@/service/interventions/interventions.action";
import { IIntervention } from "@/service/interventions/types/interventions/intervention.type";
import { IconEditCircle, IconTrash } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { getTechnicienById } from "@/service/techniciens/technicien.action";
import { getVehiculeById } from "@/service/vehicule/vehicule.action";

interface InterventionCardProps {
  intervention: IIntervention;
  onDelete: (id: string) => void;
  onUpdate: (updated: IIntervention) => void;
}

const InterventionCard = ({ intervention, onDelete, onUpdate }: InterventionCardProps) => {
  const [vehiculeNom, setVehiculeNom] = useState<string>("Chargement...");
  const [technicienNom, setTechnicienNom] = useState<string>("Chargement...");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IIntervention>({ ...intervention });

  // 🔹 Récupération nom véhicule
  useEffect(() => {
    const fetchVehicule = async () => {
      try {
        const res = await getVehiculeById(intervention.vehiculeId);
        if (res.success) {
          const data = res.data as { nom: string } | null;
          setVehiculeNom(data?.nom ?? "Inconnu");
        } else setVehiculeNom("Inconnu");
      } catch {
        setVehiculeNom("Erreur");
      }
    };
    fetchVehicule();
  }, [intervention.vehiculeId]);

  // 🔹 Récupération nom technicien
  useEffect(() => {
    const fetchTechnicien = async () => {
      try {
        const res = await getTechnicienById(intervention.technicienId);
        if (res.success) {
          const data = res.data as { nom: string } | null;
          setTechnicienNom(data?.nom ?? "Inconnu");
        } else setTechnicienNom("Inconnu");
      } catch {
        setTechnicienNom("Erreur");
      }
    };
    fetchTechnicien();
  }, [intervention.technicienId]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'URGENTE': return 'from-red-500 to-red-600';
      case 'MOYENNE': return 'from-yellow-500 to-yellow-600';
      case 'FAIBLE': return 'from-green-500 to-green-600';
      case 'ELEVEE': return 'from-yellow-500 to-green-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EN_COURS': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'TERMINEE': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'ANNULEE': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteIntervention(intervention.id);
      if (res.success) {
        toast.success("Intervention supprimée !");
        onDelete(intervention.id);
        setIsDeleteDialogOpen(false);
      } else toast.error(res.error);
    } catch {
      toast.error("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateIntervention(intervention.id, formData);
      if (res.success && "data" in res) {
        toast.success("Intervention mise à jour !");
        onUpdate(res.data as IIntervention);
        setIsUpdateDialogOpen(false);
      } else toast.error(res.error);
    } catch {
      toast.error("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300"
    >
      {/* Header with Priority Color */}
      <div className={`bg-gradient-to-r ${getPriorityColor(intervention.priorite)} px-6 py-4 flex items-start justify-between`}>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{intervention.designation || "Intervention"}</h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(intervention.statut)}`}>
              {intervention.statut}
            </span>
            <span className="text-white/80 text-xs font-semibold">Priorité: {intervention.priorite}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Principal Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Date</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{formatDate(intervention.date)}</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Coût</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{intervention.cout} €</p>
          </div>
        </div>

        {/* Technicien et Véhicule */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700/50">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">Technicien</p>
            <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mt-1">{technicienNom}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-700/50">
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase">Véhicule</p>
            <p className="text-sm font-bold text-purple-900 dark:text-purple-100 mt-1">{vehiculeNom}</p>
          </div>
        </div>

        {/* Temps */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700/50">
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase">Temps Estimé</p>
            <p className="text-sm font-bold text-green-900 dark:text-green-100 mt-1">{intervention.temps_estime_heures}h</p>
          </div>
          {intervention.temps_reel_heures && (
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-700/50">
              <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase">Temps Réel</p>
              <p className="text-sm font-bold text-orange-900 dark:text-orange-100 mt-1">{intervention.temps_reel_heures}h</p>
            </div>
          )}
        </div>

        {/* Description */}
        {intervention.description && (
          <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg border-l-4 border-indigo-500">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase mb-2">Description</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{intervention.description}</p>
          </div>
        )}

        {/* Situation */}
        {intervention.situation && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase mb-2">Situation Actuelle</p>
            <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">{intervention.situation}</p>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="flex gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700">
        {/* Update Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center cursor-pointer justify-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 py-2 rounded-lg transition font-semibold text-sm"
            >
              <IconEditCircle size={18} className="cursor-pointer" stroke={2} /> Modifier
            </motion.button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier intervention</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Désignation</label>
                <Input
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Situation</label>
                <Input
                  value={formData.situation}
                  onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Coût (€)</label>
                  <Input
                    type="number"
                    value={formData.cout}
                    onChange={(e) => setFormData({ ...formData, cout: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Temps estimé (h)</label>
                  <Input
                    type="number"
                    value={formData.temps_estime_heures}
                    onChange={(e) => setFormData({ ...formData, temps_estime_heures: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Temps réel (h)</label>
                  <Input
                    type="number"
                    value={formData.temps_reel_heures ?? ""}
                    onChange={(e) => setFormData({ ...formData, temps_reel_heures: parseFloat(e.target.value) || undefined })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Priorité</label>
                  <select
                    value={formData.priorite}
                    onChange={(e) => setFormData({ ...formData, priorite: e.target.value as IIntervention["priorite"] })}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                  >
                    <option value="FAIBLE">FAIBLE</option>
                    <option value="MOYENNE">MOYENNE</option>
                    <option value="ELEVEE">ELEVEE</option>
                            <option value="URGENTE">URGENTE</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Statut</label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value as IIntervention["statut"] })}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                >
                  <option value="EN_COURS">EN_COURS</option>
                  <option value="TERMINEE">TERMINEE</option>
                  <option value="ANNULEE">ANNULEE</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleUpdate} disabled={loading}>
                {loading ? 'Mise à jour...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center cursor-pointer justify-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 py-2 rounded-lg transition font-semibold text-sm"
            >
              <IconTrash size={18} stroke={2} /> Supprimer
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
              Etes-vous sur de vouloir supprimer l&apos;intervention <strong>{intervention.designation}</strong> ? Cette action est irreversible.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={loading}
              >
                {loading ? 'Suppression...' : 'Supprimer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};

export default InterventionCard;
