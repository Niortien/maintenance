'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, ChevronLeft, ChevronRight, Package, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { ISituation, StatutSituation } from '@/service/situation/types/situation.type';
import { adminChangeSituationStatut } from '@/service/situation/situation.action';
import { adminMarkNotificationRead } from '@/service/notification/notification.action';
import { BASE_URL } from '@/baseurl/baseurl';

interface Props {
  situation: ISituation;
  onUpdate: (updated: ISituation) => void;
}

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

const ADMIN_STATUT_ACTIONS: { statut: StatutSituation; label: string; className: string }[] = [
  { statut: 'EN_COURS', label: 'Passer en cours de traitement', className: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { statut: 'VALIDEE', label: 'Valider (situation résolue)', className: 'bg-green-600 hover:bg-green-700 text-white' },
  { statut: 'TERMINEE', label: 'Marquer comme terminée', className: 'bg-slate-600 hover:bg-slate-700 text-white' },
  { statut: 'EN_ATTENTE', label: 'Remettre en attente', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
];

const AdminSituationCard = ({ situation, onUpdate }: Props) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const queryClient = useQueryClient();

  const statut: StatutSituation = situation.statut ?? 'EN_ATTENTE';
  const allImages = situation.images?.length > 0
    ? situation.images.map((img) => `${BASE_URL}/${img.url}`)
    : situation.image ? [`${BASE_URL}/${situation.image}`] : [];

  const coverImage = allImages[0] ?? null;
  const totalGeneral = situation.besoins.reduce((acc, b) => acc + b.quantite * b.prixUnitaire, 0);

  const handleChangeStatut = async (newStatut: StatutSituation) => {
    if (newStatut === statut) return;
    setLoading(true);
    try {
      const res = await adminChangeSituationStatut(situation.id, newStatut);
      if (res.success) {
        toast.success(`Statut mis à jour : ${STATUT_LABELS[newStatut]}`);
        onUpdate(res.data);
        setDetailOpen(false);
        // Mark ALL unread notifications linked to this situation as read
        // Always fetch fresh to avoid stale/empty cache issues
        const { adminGetUnreadNotifications } = await import('@/service/notification/notification.action');
        const fresh = await adminGetUnreadNotifications();
        if (fresh.success) {
          const linked = fresh.data.filter((n) => n.situationId === situation.id);
          await Promise.all(linked.map((n) => adminMarkNotificationRead(n.id)));
        }
        queryClient.invalidateQueries({ queryKey: ['admin-notif-count'] });
        queryClient.invalidateQueries({ queryKey: ['admin-notifs-unread'] });
      } else toast.error(res.error);
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition"
    >
      {/* Cover image */}
      <div className="relative h-36">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImage} alt={situation.nom} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-orange-900 to-amber-800 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-white/40" />
          </div>
        )}
        {/* Statut badge */}
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUT_COLORS[statut]}`}>
          {STATUT_LABELS[statut]}
        </span>
        {allImages.length > 1 && (
          <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">
            {allImages.length} photos
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent px-3 pt-6 pb-2">
          <p className="font-bold text-white text-sm">{situation.nom}</p>
          <p className="text-white/60 text-xs">{situation.equipement?.categorie ?? ''}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{situation.description}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          {new Date(situation.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
          {situation.besoins.length > 0 && (
            <>
              <Package className="h-3.5 w-3.5 ml-auto text-amber-500 shrink-0" />
              <span className="text-amber-400 font-semibold">{totalGeneral.toLocaleString('fr-FR')} FCFA</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 pb-3">
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogTrigger asChild>
            <button className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 rounded-lg transition">
              <Eye className="h-4 w-4" /> Voir &amp; gérer
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-amber-400 font-bold">{situation.nom}</DialogTitle>
              <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full border w-fit ${STATUT_COLORS[statut]}`}>
                {STATUT_LABELS[statut]}
              </span>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Image gallery */}
              {allImages.length > 0 && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={allImages[imgIdx]} alt={`Photo ${imgIdx + 1}`} className="w-full rounded-xl object-cover max-h-56" />
                  {allImages.length > 1 && (
                    <>
                      <button onClick={() => setImgIdx((i) => (i - 1 + allImages.length) % allImages.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button onClick={() => setImgIdx((i) => (i + 1) % allImages.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                        {imgIdx + 1} / {allImages.length}
                      </span>
                    </>
                  )}
                </div>
              )}

              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">Description / Diagnostic</p>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{situation.description}</p>
              </div>

              {situation.besoins.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 mb-2">Besoins logistiques</p>
                  <div className="space-y-1.5">
                    {situation.besoins.map((b, idx) => (
                      <div key={b.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                        <span className="text-sm text-gray-300">
                          <span className="font-semibold text-amber-400 mr-1">{idx + 1}.</span>
                          {b.quantite > 1 ? `${b.quantite}×` : ''} {b.designation}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {(b.quantite * b.prixUnitaire).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-gray-700">
                      <span className="text-sm font-bold text-gray-400">Total</span>
                      <span className="text-base font-extrabold text-amber-400">
                        {totalGeneral.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Changer statut (admin: all statuts) */}
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Changer le statut</p>
                <div className="grid grid-cols-2 gap-2">
                  {ADMIN_STATUT_ACTIONS.filter((a) => a.statut !== statut).map((action) => (
                    <Button
                      key={action.statut}
                      className={`text-xs ${action.className}`}
                      disabled={loading}
                      onClick={() => handleChangeStatut(action.statut)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};

export default AdminSituationCard;
