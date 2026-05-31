'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { adminUpdateResponsable, adminDeleteResponsable } from '@/service/auth/auth.action';
import { IAdminResponsable } from '@/service/auth/types/auth.type';
import toast from 'react-hot-toast';

// ─── Boutons d'action (edit + delete) ────────────────────────────────────────
export function ResponsableActions({ responsable }: { responsable: IAdminResponsable }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowEdit(true)}
          className="rounded-md border border-gray-700 px-2.5 py-1 text-xs text-gray-300 hover:border-amber-500 hover:text-amber-400 transition"
        >
          Modifier
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="rounded-md border border-gray-700 px-2.5 py-1 text-xs text-gray-300 hover:border-red-500 hover:text-red-400 transition"
        >
          Supprimer
        </button>
      </div>

      {showEdit && (
        <EditModal responsable={responsable} onClose={() => setShowEdit(false)} />
      )}
      {showDelete && (
        <DeleteModal responsable={responsable} onClose={() => setShowDelete(false)} />
      )}
    </>
  );
}

// ─── Modal d'édition ─────────────────────────────────────────────────────────
function EditModal({
  responsable,
  onClose,
}: {
  responsable: IAdminResponsable;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [nom, setNom] = useState(responsable.nom);
  const [prenom, setPrenom] = useState(responsable.prenom);
  const [telephone, setTelephone] = useState(responsable.telephone ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await adminUpdateResponsable(responsable.id, {
        nom: nom.trim() || undefined,
        prenom: prenom.trim() || undefined,
        telephone: telephone.trim() || undefined,
      });
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      toast.success('Responsable mis à jour.');
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
        <h2 className="mb-5 text-base font-semibold text-white">
          Modifier — {responsable.prenom} {responsable.nom}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">Prénom</label>
              <input
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">Nom</label>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Téléphone</label>
            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+22501234567"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:text-white transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-amber-400 disabled:opacity-60 transition"
            >
              {isPending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal de suppression ────────────────────────────────────────────────────
function DeleteModal({
  responsable,
  onClose,
}: {
  responsable: IAdminResponsable;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const res = await adminDeleteResponsable(responsable.id);
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      toast.success(`${responsable.prenom} ${responsable.nom} supprimé.`);
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h2 className="mb-1 text-base font-semibold text-white">Supprimer le responsable ?</h2>
        <p className="mb-5 text-sm text-gray-400">
          <span className="font-medium text-white">{responsable.prenom} {responsable.nom}</span> ({responsable.email}) sera définitivement supprimé. Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:text-white transition"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60 transition"
          >
            {isPending ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}
