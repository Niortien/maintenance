'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MapPin, Pencil, Trash2, Globe, User, Car, Users, FileText, LayoutDashboard } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { ISite } from '@/service/site/types/site.type';
import { deleteSite, updateSite } from '@/service/site/site.action';

interface SiteCardProps {
  site: ISite;
  onDelete: (id: string) => void;
  onUpdate: (updated: ISite) => void;
}

const SiteCard = ({ site, onDelete, onUpdate }: SiteCardProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nom: site.nom, code: site.code, region: site.region ?? '' });
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteSite(site.id);
      if (res.success) {
        toast.success('Site supprimé !');
        onDelete(site.id);
        queryClient.invalidateQueries({ queryKey: ['sites', 'list'] });
        setIsDeleteOpen(false);
      } else toast.error('Erreur: ' + res.error);
    } catch { toast.error('Erreur inattendue'); }
    finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateSite(site.id, formData);
      if (res.success) {
        toast.success('Site mis à jour !');
        onUpdate(res.data as ISite);
        queryClient.invalidateQueries({ queryKey: ['sites', 'list'] });
        setIsUpdateOpen(false);
      } else toast.error('Erreur: ' + res.error);
    } catch { toast.error('Erreur inattendue'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
          <MapPin className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{site.nom}</h3>
          <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
            {site.code}
          </span>
        </div>
      </div>

      {site.region && (
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Globe className="h-4 w-4" />
          {site.region}
        </div>
      )}

      {site.responsable && (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <User className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{site.responsable.nom} {site.responsable.prenom}</span>
          {site.responsable.telephone && (
            <span className="text-xs text-slate-400 ml-1">· {site.responsable.telephone}</span>
          )}
        </div>
      )}

      {site._count && (
        <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><Car className="h-3 w-3" />{site._count.vehicules} véhicules</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{site._count.techniciens} techs</span>
          <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{site._count.rapports} rapports</span>
        </div>
      )}

      <Link href={`/sites/${site.id}`}
        className="flex items-center justify-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 border border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-900/20 rounded-lg py-2 transition-colors">
        <LayoutDashboard className="h-4 w-4" />
        Voir le dashboard
      </Link>

      <div className="flex gap-2 mt-auto">
        {/* Update */}
        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex-1 gap-1">
              <Pencil className="h-3 w-3" /> Modifier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Modifier le site</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div><label className="text-sm font-medium">Nom</label>
                <Input value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Code</label>
                <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Région</label>
                <Input value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>Annuler</Button>
              <Button onClick={handleUpdate} disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white">
                {loading ? 'Mise à jour...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex-1 gap-1 text-red-600 hover:bg-red-50">
              <Trash2 className="h-3 w-3" /> Supprimer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Supprimer le site</DialogTitle></DialogHeader>
            <p className="text-sm text-slate-600">Êtes-vous sûr de vouloir supprimer <strong>{site.nom}</strong> ?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
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

export default SiteCard;