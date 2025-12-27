'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IVehicule } from "@/service/vehicule/types/vehicule.type";
import { deleteVehicule, updateVehicule } from "@/service/vehicule/vehicule.action";
import { IconEditCircle, IconPackage, IconTrash, IconTruck } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Car, Package, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface VehiculeCardsProps {
  vehicule: IVehicule;
  onDelete: (id: string) => void;
  onUpdate: (updated: IVehicule) => void;
}

const VehiculeCards = ({ vehicule, onDelete, onUpdate }: VehiculeCardsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IVehicule>({ ...vehicule });

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'CAMION': return <IconTruck className="h-8 w-8 text-white" />;
      case 'CAMIONNETTE': return <IconPackage className="h-8 w-8 text-white" />;
      case 'VOITURE': return <Car className="h-8 w-8 text-white" />;
      case 'EQUIPEMENT': return <Package className="h-8 w-8 text-white" />;
      default: return <Truck className="h-8 w-8 text-white" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIF': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'EN_MAINTENANCE': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'INACTIF': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CAMION': return 'from-blue-500 to-blue-600';
      case 'CAMIONNETTE': return 'from-orange-500 to-orange-600';
      case 'VOITURE': return 'from-green-500 to-green-600';
      case 'EQUIPEMENT': return 'from-purple-500 to-purple-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const handleDeleteVehicule = async () => {
    setLoading(true);
    try {
      const res = await deleteVehicule(vehicule.id);
      if (res.success) {
        toast.success("Véhicule supprimé !");
        onDelete(vehicule.id);
        setIsDeleteDialogOpen(false);
      } else toast.error("Erreur: " + res.error);
    } catch {
      toast.error("Erreur inattendue");
    } finally { setLoading(false); }
  };

  const handleUpdateVehicule = async () => {
    setLoading(true);
    try {
      const res = await updateVehicule(vehicule.id, formData);
      if (res.success && "data" in res) {
        toast.success("Véhicule mis à jour !");
        onUpdate(res.data as IVehicule);
        setIsUpdateDialogOpen(false);
      } else toast.error("Erreur: " + res.error);
    } catch {
      toast.error("Erreur inattendue");
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
    >
      {/* Header with Icon */}
      <div className={`bg-gradient-to-r ${getTypeColor(vehicule.type)} px-6 py-4 flex items-center gap-4`}>
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
          {getVehicleIcon(vehicule.type)}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">{vehicule.nom}</h3>
          <p className="text-white/80 text-sm">{vehicule.type}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(vehicule.statut)}`}>
          {vehicule.statut}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Détails principaux */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Modèle</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{vehicule.modele}</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Année</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{vehicule.annee}</p>
          </div>
        </div>

        {/* Plaque immatriculation */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700/50">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase mb-2">Immatriculation</p>
          <p className="text-lg font-mono font-bold text-purple-700 dark:text-purple-400">{vehicule.numero_de_plaque}</p>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="flex gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700">
        {/* Update Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 py-2 rounded-lg transition font-semibold text-sm"
            >
              <IconEditCircle size={18} stroke={2} /> Modifier
            </motion.button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le véhicule</DialogTitle>
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
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Modèle</label>
                <Input
                  value={formData.modele}
                  onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Plaque</label>
                <Input
                  value={formData.numero_de_plaque}
                  onChange={(e) => setFormData({ ...formData, numero_de_plaque: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                >
                  <option value="CAMION">CAMION</option>
                  <option value="CAMIONNETTE">CAMIONNETTE</option>
                  <option value="VOITURE">VOITURE</option>
                  <option value="EQUIPEMENT">EQUIPEMENT</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Statut</label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                >
                  <option value="ACTIF">ACTIF</option>
                  <option value="EN_MAINTENANCE">EN MAINTENANCE</option>
                  <option value="INACTIF">INACTIF</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleUpdateVehicule} disabled={loading}>
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
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
              className="flex-1 flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 py-2 rounded-lg transition font-semibold text-sm"
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
              Êtes-vous sûr de vouloir supprimer le véhicule <strong>{vehicule.nom}</strong> ? Cette action est irréversible.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteVehicule} 
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

export default VehiculeCards;
