'use client';

import { Button } from "@/components/ui/button";
import { deleteIntervention, updateIntervention } from "@/service/interventions/interventions.action";
import { IIntervention } from "@/service/interventions/types/interventions/intervention.type";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import dynamic from "next/dynamic";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getTechnicienById } from "@/service/techniciens/technicien.action";
import { getVehiculeById } from "@/service/vehicule/vehicule.action";
import { Pencil, Trash2, Clock, Wrench, Car, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const InterventionPDFButton = dynamic(() => import("@/components/pdf/intervention-pdf-button"), { ssr: false, loading: () => <span className="text-xs text-slate-400">...</span> });

interface InterventionCardProps {
  intervention: IIntervention;
  onDelete: (id: string) => void;
  onUpdate: (updated: IIntervention) => void;
}

const prioriteConfig: Record<string, { label: string; cls: string; headerCls: string }> = {
  URGENTE: { label: 'Urgente', cls: 'bg-red-100 text-red-700', headerCls: 'from-red-700 to-red-600' },
  ELEVEE: { label: 'Ã‰levÃ©e', cls: 'bg-orange-100 text-orange-700', headerCls: 'from-orange-600 to-orange-500' },
  MOYENNE: { label: 'Moyenne', cls: 'bg-amber-100 text-amber-700', headerCls: 'from-amber-600 to-amber-500' },
  FAIBLE: { label: 'Faible', cls: 'bg-emerald-100 text-emerald-700', headerCls: 'from-emerald-700 to-emerald-600' },
};

const statutIcon = { EN_COURS: Clock, TERMINEE: CheckCircle, ANNULEE: XCircle };
const statutCls: Record<string, string> = {
  EN_COURS: 'bg-blue-100 text-blue-700',
  TERMINEE: 'bg-emerald-100 text-emerald-700',
  ANNULEE: 'bg-slate-100 text-slate-500',
};

const InterventionCard = ({ intervention, onDelete, onUpdate }: InterventionCardProps) => {
  const [vehiculeNom, setVehiculeNom] = useState<string>("...");
  const [technicienNom, setTechnicienNom] = useState<string>("...");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IIntervention>({ ...intervention });

  useEffect(() => {
    getVehiculeById(intervention.vehiculeId).then(res => {
      const d = res.success ? res.data as { nom: string } | null : null;
      setVehiculeNom(d?.nom ?? "Inconnu");
    }).catch(() => setVehiculeNom("Inconnu"));
  }, [intervention.vehiculeId]);

  useEffect(() => {
    getTechnicienById(intervention.technicienId).then(res => {
      const d = res.success ? res.data as { nom: string; prenom?: string } | null : null;
      setTechnicienNom(d ? `${d.nom} ${d.prenom ?? ''}`.trim() : "Inconnu");
    }).catch(() => setTechnicienNom("Inconnu"));
  }, [intervention.technicienId]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  const pConf = prioriteConfig[intervention.priorite] ?? prioriteConfig.FAIBLE;
  const StatutIcon = statutIcon[intervention.statut as keyof typeof statutIcon] ?? AlertTriangle;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteIntervention(intervention.id);
      if (res.success) { toast.success("Intervention supprimÃ©e !"); onDelete(intervention.id); setIsDeleteDialogOpen(false); }
      else toast.error(res.error);
    } catch { toast.error("Erreur inattendue"); } finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateIntervention(intervention.id, formData);
      if (res.success && "data" in res) { toast.success("Mise Ã  jour !"); onUpdate(res.data as IIntervention); setIsUpdateDialogOpen(false); }
      else toast.error(res.error);
    } catch { toast.error("Erreur inattendue"); } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(5, 150, 105, 0.15)' }}
      transition={{ duration: 0.25 }}
      className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-slate-700 overflow-hidden"
    >
      {/* Header colorÃ© par prioritÃ© */}
      <div className={`bg-gradient-to-r ${pConf.headerCls} px-5 py-4`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate text-base">{intervention.designation || "Intervention"}</h3>
            <p className="text-white/70 text-xs mt-0.5">{formatDate(intervention.date)}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${pConf.cls}`}>
              {pConf.label}
            </span>
            <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${statutCls[intervention.statut]}`}>
              <StatutIcon className="h-3 w-3" />
              {intervention.statut.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Corps */}
      <div className="px-5 py-4 space-y-3">
        {/* Technicien & VÃ©hicule */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-emerald-700 font-medium">Technicien</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{technicienNom}</p>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 flex items-center gap-2">
            <Car className="h-4 w-4 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-amber-700 font-medium">VÃ©hicule</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{vehiculeNom}</p>
            </div>
          </div>
        </div>

        {/* Temps & CoÃ»t */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl py-2.5 px-2">
            <p className="text-xs text-slate-500 font-medium">EstimÃ©</p>
            <p className="text-sm font-bold text-slate-800 dark:text-white">{intervention.temps_estime_heures}h</p>
          </div>
          {intervention.temps_reel_heures != null && (
            <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl py-2.5 px-2">
              <p className="text-xs text-slate-500 font-medium">RÃ©el</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{intervention.temps_reel_heures}h</p>
            </div>
          )}
          <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl py-2.5 px-2">
            <p className="text-xs text-slate-500 font-medium">CoÃ»t</p>
            <p className="text-sm font-bold text-slate-800 dark:text-white">{intervention.cout?.toLocaleString('fr-FR')} F</p>
          </div>
        </div>

        {/* Description */}
        {intervention.description && (
          <div className="border-l-2 border-emerald-400 pl-3 py-1">
            <p className="text-xs text-emerald-700 font-medium uppercase mb-0.5">Description</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{intervention.description}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 pb-4">
        <InterventionPDFButton
          intervention={intervention}
          technicienNom={technicienNom}
          vehiculeNom={vehiculeNom}
        />

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogTrigger asChild>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 py-2 rounded-lg transition text-sm font-medium">
              <Pencil className="h-4 w-4" /> Modifier
            </motion.button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Modifier l&apos;intervention</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">DÃ©signation</label>
                <Input value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" rows={3} />
              </div>
              <div>
                <label className="text-sm font-semibold">Situation</label>
                <Input value={formData.situation} onChange={(e) => setFormData({ ...formData, situation: e.target.value })} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">CoÃ»t (FCFA)</label>
                  <Input type="number" value={formData.cout} onChange={(e) => setFormData({ ...formData, cout: parseFloat(e.target.value) || 0 })} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Temps estimÃ© (h)</label>
                  <Input type="number" value={formData.temps_estime_heures} onChange={(e) => setFormData({ ...formData, temps_estime_heures: parseFloat(e.target.value) || 0 })} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Temps rÃ©el (h)</label>
                  <Input type="number" value={formData.temps_reel_heures ?? ""} onChange={(e) => setFormData({ ...formData, temps_reel_heures: parseFloat(e.target.value) || undefined })} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold">PrioritÃ©</label>
                  <select value={formData.priorite} onChange={(e) => setFormData({ ...formData, priorite: e.target.value as IIntervention["priorite"] })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-slate-800">
                    {['FAIBLE', 'MOYENNE', 'ELEVEE', 'URGENTE'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold">Statut</label>
                <select value={formData.statut} onChange={(e) => setFormData({ ...formData, statut: e.target.value as IIntervention["statut"] })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-slate-800">
                  {['EN_COURS', 'TERMINEE', 'ANNULEE'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleUpdate} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 p-2 rounded-lg transition">
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="text-red-600">Supprimer l&apos;intervention</DialogTitle></DialogHeader>
            <p className="text-slate-600 dark:text-slate-400">
              Supprimer <strong>{intervention.designation}</strong> ? Cette action est irrÃ©versible.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
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
