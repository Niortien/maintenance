'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2, Loader2 } from 'lucide-react';
import { IRepartition } from '@/service/repartition/types/repartition.type';
import { deleteRepartition } from '@/service/repartition/repartition.action';

interface Props {
  repartitions: IRepartition[];
  showDesignation?: boolean;
}

const fmt = (n: number) => n.toLocaleString('fr-FR');
const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR');

const RepartitionTable = ({ repartitions, showDesignation }: Props) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette répartition ?')) return;
    setDeletingId(id);
    const res = await deleteRepartition(id);
    setDeletingId(null);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast.success('Répartition supprimée');
    queryClient.invalidateQueries({ queryKey: ['repartitions'] });
    queryClient.invalidateQueries({ queryKey: ['repartitions-summary'] });
  };

  if (repartitions.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl bg-white border-2 border-dashed border-slate-200">
        <p className="text-slate-500 font-medium">Aucune répartition enregistrée pour cette période</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-emerald-700 text-white">
            <th className="text-left px-3 py-2 font-medium">Date</th>
            {showDesignation && <th className="text-left px-3 py-2 font-medium">Désignation</th>}
            <th className="text-right px-3 py-2 font-medium">Qté</th>
            <th className="text-right px-3 py-2 font-medium">PU achat</th>
            <th className="text-right px-3 py-2 font-medium">Montant achat</th>
            <th className="text-right px-3 py-2 font-medium">PU vente</th>
            <th className="text-right px-3 py-2 font-medium">Montant vente</th>
            <th className="text-right px-3 py-2 font-medium">Bénéfice</th>
            <th className="text-left px-3 py-2 font-medium">Engin</th>
            <th className="text-left px-3 py-2 font-medium">Fournisseur</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {repartitions.map((r, i) => (
            <tr key={r.id} className={i % 2 === 1 ? 'bg-slate-50' : ''}>
              <td className="px-3 py-2 whitespace-nowrap">{fmtDate(r.date)}</td>
              {showDesignation && <td className="px-3 py-2">{r.designation ?? '—'}</td>}
              <td className="px-3 py-2 text-right">{fmt(r.quantite)}</td>
              <td className="px-3 py-2 text-right">{fmt(r.prixUnitaireAchat)}</td>
              <td className="px-3 py-2 text-right">{fmt(r.montantAchat)}</td>
              <td className="px-3 py-2 text-right">{fmt(r.prixUnitaireVente)}</td>
              <td className="px-3 py-2 text-right">{fmt(r.montantVente)}</td>
              <td className={`px-3 py-2 text-right font-medium ${r.benefice >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {fmt(r.benefice)}
              </td>
              <td className="px-3 py-2">{r.vehicule?.nom ?? '—'}</td>
              <td className="px-3 py-2">{r.fournisseur ?? '—'}</td>
              <td className="px-3 py-2 text-right">
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deletingId === r.id}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  title="Supprimer"
                >
                  {deletingId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RepartitionTable;
