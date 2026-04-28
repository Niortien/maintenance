'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IVehicule } from "@/service/vehicule/types/vehicule.type";
import { deleteVehicule, updateVehicule } from "@/service/vehicule/vehicule.action";
import { motion } from "framer-motion";
import { Car, Package, Truck, Pencil, Trash2, Hash, Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import toast from 'react-hot-toast';

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
      case 'CAMION': return <Truck className="h-7 w-7 text-white" />;
      case 'CAMIONNETTE': return <Package className="h-7 w-7 text-white" />;
      default: return <Car className="h-7 w-7 text-white" />;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIF': return { label: 'Actif', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' };
      case 'EN_MAINTENANCE': return { label: 'En maintenance', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' };
      case 'INACTIF': return { label: 'Inactif', cls: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' };
      default: return { label: status, cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'CAMION': return 'from-emerald-700 to-emerald-600';
      case 'CAMIONNETTE': return 'from-teal-700 to-teal-600';
      case 'VOITURE': return 'from-green-700 to-green-600';
      default: return 'from-emerald-800 to-emerald-700';
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
      const payload = { ...formData, siteId: formData.siteId ?? undefined, site: undefined } as Parameters<typeof updateVehicule>[1];
      const res = await updateVehicule(vehicule.id, payload);
      if (res.success && "data" in res) {
        toast.success("Véhicule mis à jour !");
        onUpdate(res.data as IVehicule);
        setIsUpdateDialogOpen(false);
      } else toast.error("Erreur: " + res.error);
    } catch {
      toast.error("Erreur inattendue");
    } finally { setLoading(false); }
  };

  const statusConf = getStatusConfig(vehicule.statut);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(5, 150, 105, 0.15)' }}
      transition={{ duration: 0.25 }}
      className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-slate-700 overflow-hidden transition-all duration-300"
    >
      {/* Header coloré */}
      <div className={`bg-gradient-to-r ${getTypeGradient(vehicule.type)} px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
            {getVehicleIcon(vehicule.type)}
          </div>
          <div>
            <p className="font-bold text-white text-base">{vehicule.nom}</p>
            <p className="text-emerald-200 text-xs">{vehicule.type} · {vehicule.modele}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConf.cls}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusConf.dot}`} />
          {statusConf.label}
        </div>
      </div>

      {/* Infos */}
      <div className="px-5 py-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Hash className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span className="font-mono font-semibold text-slate-800 dark:text-white">{vehicule.numero_de_plaque}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Calendar className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{vehicule.annee}</span>
        </div>
        {vehicule.site && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 col-span-2">
            <MapPin className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>{vehicule.site.nom}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 pb-4">
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 py-2 rounded-lg transition text-sm font-medium"
            >
              <Pencil className="h-4 w-4" /> Modifier
            </motion.button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Modifier le véhicule</DialogTitle></DialogHeader>
            <div className="space-y-4">
              {[
                { label: 'Nom', key: 'nom' },
                { label: 'Modèle', key: 'modele' },
                { label: 'Plaque', key: 'numero_de_plaque' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
                  <Input value={(formData as unknown as Record<string, string>)[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="mt-1" />
                </div>
              ))}
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">
                  {['CAMION', 'CAMIONNETTE', 'VOITURE', 'EQUIPEMENT'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Statut</label>
                <select value={formData.statut} onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">
                  <option value="ACTIF">ACTIF</option>
                  <option value="EN_MAINTENANCE">EN MAINTENANCE</option>
                  <option value="INACTIF">INACTIF</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleUpdateVehicule} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="text-red-600">Supprimer le véhicule</DialogTitle></DialogHeader>
            <p className="text-slate-600 dark:text-slate-400">
              Supprimer <strong>{vehicule.nom}</strong> ({vehicule.numero_de_plaque}) ? Cette action est irréversible.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={handleDeleteVehicule} disabled={loading}>
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