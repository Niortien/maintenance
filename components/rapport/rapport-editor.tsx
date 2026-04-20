'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Check, X, ChevronRight, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { getAllSites } from '@/service/site/site.action';
import { createRapport } from '@/service/rapport/rapport.action';
import type {
  CategorieVehicule,
  StatutVehiculeRapport,
  TypePanne,
  IRapport,
} from '@/service/rapport/types/rapport.type';

// ─── Constantes & labels ──────────────────────────────────────────────────────

const CATEGORIE_LABELS: Record<CategorieVehicule, string> = {
  TASSEUR: 'Tasseur',
  BP: 'BP',
  AMPLIROLL: 'Ampliroll',
  TRACTEUR: 'Tracteur',
  KIA: 'KIA',
  VOITURETTE: 'Voiturette',
  PC: 'PC',
  MOTO_TRICYCLE: 'Moto-Tricycle',
  KB: 'KB',
};

const STATUT_CONFIG: Record<
  StatutVehiculeRapport,
  { label: string; color: string; dot: string }
> = {
  OPERATIONNEL: {
    label: 'Opérationnel',
    color: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  EN_PANNE: { label: 'En panne', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  ACCIDENTE: {
    label: 'Accidenté',
    color: 'bg-orange-100 text-orange-700',
    dot: 'bg-orange-500',
  },
  EN_ATTENTE: {
    label: 'En attente',
    color: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
  },
};

const TYPES_PANNES_LABELS: Record<TypePanne, string> = {
  MECANIQUE: 'Mécanique',
  AIR: 'Air',
  ELECTRICITE: 'Électricité',
  SOUDURE: 'Soudure',
  HYDRAULIQUE: 'Hydraulique',
  PNEUMATIQUE: 'Pneumatique',
  POMPE_INJECTION: 'Pompe à injection',
  PNEU: 'Pneu',
  CARROSSERIE: 'Carrosserie',
  AUTRE: 'Autre',
};

const ALL_CATEGORIES: CategorieVehicule[] = [
  'TASSEUR',
  'BP',
  'AMPLIROLL',
  'TRACTEUR',
  'KIA',
  'MOTO_TRICYCLE',
  'VOITURETTE',
  'PC',
  'KB',
];

const ALL_STATUTS: StatutVehiculeRapport[] = [
  'OPERATIONNEL',
  'EN_PANNE',
  'ACCIDENTE',
  'EN_ATTENTE',
];

const ALL_TYPES_PANNES: TypePanne[] = [
  'MECANIQUE',
  'AIR',
  'ELECTRICITE',
  'SOUDURE',
  'HYDRAULIQUE',
  'PNEUMATIQUE',
  'POMPE_INJECTION',
  'PNEU',
  'CARROSSERIE',
  'AUTRE',
];

// ─── Type local ───────────────────────────────────────────────────────────────

export type LigneLocal = {
  tempId: string;
  codeVehicule: string;
  immatriculation: string;
  categorie: CategorieVehicule;
  statut: StatutVehiculeRapport;
  typesPannes: TypePanne[];
  description: string;
};

function mkId() {
  return Math.random().toString(36).slice(2);
}

function emptyLigne(categorie: CategorieVehicule): LigneLocal {
  return {
    tempId: mkId(),
    codeVehicule: '',
    immatriculation: '',
    categorie,
    statut: 'OPERATIONNEL',
    typesPannes: [],
    description: '',
  };
}

// ─── Formulaire inline ────────────────────────────────────────────────────────

function LigneForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: LigneLocal;
  onSave: (l: LigneLocal) => void;
  onCancel: () => void;
}) {
  const [ligne, setLigne] = useState<LigneLocal>(initial);
  const showPannes = ligne.statut !== 'OPERATIONNEL';

  function set<K extends keyof LigneLocal>(k: K, v: LigneLocal[K]) {
    setLigne((prev) => ({ ...prev, [k]: v }));
  }

  function togglePanne(t: TypePanne) {
    const cur = ligne.typesPannes;
    set('typesPannes', cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]);
  }

  return (
    <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 space-y-3">
      {/* Code + immat */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Code véhicule <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm uppercase focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            placeholder="ex: T105"
            value={ligne.codeVehicule}
            onChange={(e) => set('codeVehicule', e.target.value.toUpperCase())}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Immatriculation
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm uppercase focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            placeholder="ex: 5985KT"
            value={ligne.immatriculation}
            onChange={(e) => set('immatriculation', e.target.value.toUpperCase())}
          />
        </div>
      </div>

      {/* Statut */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Statut</label>
        <div className="flex gap-2 flex-wrap">
          {ALL_STATUTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set('statut', s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                ligne.statut === s
                  ? STATUT_CONFIG[s].color + ' border-current'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
              }`}
            >
              {STATUT_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Types de pannes + description */}
      {showPannes && (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Types de pannes
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TYPES_PANNES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => togglePanne(t)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                    ligne.typesPannes.includes(t)
                      ? 'bg-red-100 border-red-400 text-red-700 font-medium'
                      : 'border-gray-300 text-gray-500 hover:bg-gray-100 bg-white'
                  }`}
                >
                  {TYPES_PANNES_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description de la panne
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              placeholder="ex: Problème de pompe à injection"
              value={ligne.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
        </>
      )}

      {/* Boutons */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition bg-white"
        >
          <X className="h-3.5 w-3.5" /> Annuler
        </button>
        <button
          type="button"
          onClick={() => ligne.codeVehicule.trim() && onSave(ligne)}
          disabled={!ligne.codeVehicule.trim()}
          className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition"
        >
          <Check className="h-3.5 w-3.5" /> Valider
        </button>
      </div>
    </div>
  );
}

// ─── Ligne row ────────────────────────────────────────────────────────────────

function LigneRow({
  ligne,
  onEdit,
  onDelete,
}: {
  ligne: LigneLocal;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statut = STATUT_CONFIG[ligne.statut];
  const hasPannes = ligne.statut !== 'OPERATIONNEL';

  return (
    <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 group transition-colors">
      <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${statut.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-bold text-sm text-gray-900">{ligne.codeVehicule}</span>
          {ligne.immatriculation && (
            <span className="text-xs text-gray-400 font-mono">({ligne.immatriculation})</span>
          )}
          <span
            className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${statut.color}`}
          >
            {statut.label}
          </span>
        </div>
        {hasPannes && (
          <div className="mt-1 space-y-0.5">
            {ligne.typesPannes.length > 0 && (
              <p className="text-xs text-red-600 font-medium">
                {ligne.typesPannes.map((t) => TYPES_PANNES_LABELS[t]).join(' · ')}
              </p>
            )}
            {ligne.description && (
              <p className="text-xs text-gray-500 italic">{ligne.description}</p>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
          title="Modifier"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
          title="Supprimer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Section catégorie ────────────────────────────────────────────────────────

function CategorySection({
  categorie,
  lignes,
  onAdd,
  onEdit,
  onDelete,
}: {
  categorie: CategorieVehicule;
  lignes: LigneLocal[];
  onAdd: (l: LigneLocal) => void;
  onEdit: (tempId: string, l: LigneLocal) => void;
  onDelete: (tempId: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const ops = lignes.filter((l) => l.statut === 'OPERATIONNEL').length;
  const total = lignes.length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Header catégorie */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-gray-800 uppercase tracking-wide">
            {CATEGORIE_LABELS[categorie]}
          </span>
          {total > 0 && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                ops === total ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {ops}/{total}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setAdding(true);
            setEditingId(null);
          }}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition"
        >
          <Plus className="h-3.5 w-3.5" />
          Ajouter
        </button>
      </div>

      {/* Lignes */}
      <div className="px-2 py-1">
        {total === 0 && !adding && (
          <p className="text-xs text-gray-400 text-center py-4 italic">
            Aucun véhicule — cliquez sur Ajouter
          </p>
        )}

        {lignes.map((ligne) =>
          editingId === ligne.tempId ? (
            <div key={ligne.tempId} className="py-2">
              <LigneForm
                initial={ligne}
                onSave={(updated) => {
                  onEdit(ligne.tempId, updated);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <LigneRow
              key={ligne.tempId}
              ligne={ligne}
              onEdit={() => {
                setEditingId(ligne.tempId);
                setAdding(false);
              }}
              onDelete={() => onDelete(ligne.tempId)}
            />
          ),
        )}

        {adding && (
          <div className="py-2">
            <LigneForm
              initial={emptyLigne(categorie)}
              onSave={(l) => {
                onAdd(l);
                setAdding(false);
              }}
              onCancel={() => setAdding(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Panel récapitulatif ──────────────────────────────────────────────────────

function RecapPanel({ lignes }: { lignes: LigneLocal[] }) {
  const byCategorie = useMemo(() => {
    const groups: Partial<Record<CategorieVehicule, LigneLocal[]>> = {};
    for (const l of lignes) {
      if (!groups[l.categorie]) groups[l.categorie] = [];
      groups[l.categorie]!.push(l);
    }
    return groups;
  }, [lignes]);

  const pannes = useMemo(
    () => lignes.filter((l) => l.statut !== 'OPERATIONNEL'),
    [lignes],
  );

  const usedCategories = ALL_CATEGORIES.filter(
    (c) => (byCategorie[c]?.length ?? 0) > 0,
  );

  return (
    <div className="space-y-4 sticky top-20">
      {/* Récapitulatif opérationnel */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Récapitulatif
        </h3>
        {usedCategories.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-2 italic">Aucun véhicule</p>
        ) : (
          <div className="space-y-1">
            {usedCategories.map((cat) => {
              const ligs = byCategorie[cat] ?? [];
              const ops = ligs.filter((l) => l.statut === 'OPERATIONNEL').length;
              const total = ligs.length;
              return (
                <div
                  key={cat}
                  className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm text-gray-700">{CATEGORIE_LABELS[cat]}</span>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      ops === total ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {ops}/{total}
                  </span>
                </div>
              );
            })}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-gray-500">Total</span>
              <span className="text-xs font-bold text-gray-700 tabular-nums">
                {lignes.filter((l) => l.statut === 'OPERATIONNEL').length}/{lignes.length}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pannes */}
      {pannes.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">
            Pannes & Indisponibles ({pannes.length})
          </h3>
          <div className="space-y-2">
            {pannes.map((l) => (
              <div
                key={l.tempId}
                className="pb-2 border-b border-red-100 last:border-0 last:pb-0"
              >
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-mono font-bold text-sm text-red-800">
                    {l.codeVehicule}
                  </span>
                  {l.immatriculation && (
                    <span className="text-xs text-red-400 font-mono">
                      ({l.immatriculation})
                    </span>
                  )}
                  <span
                    className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      STATUT_CONFIG[l.statut].color
                    }`}
                  >
                    {STATUT_CONFIG[l.statut].label}
                  </span>
                </div>
                {l.typesPannes.length > 0 && (
                  <p className="text-xs text-red-600 mt-0.5 font-medium">
                    {l.typesPannes.map((t) => TYPES_PANNES_LABELS[t]).join(' · ')}
                  </p>
                )}
                {l.description && (
                  <p className="text-xs text-gray-500 italic mt-0.5">{l.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Éditeur principal ────────────────────────────────────────────────────────

export function RapportEditor({ existingRapport }: { existingRapport?: IRapport }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(
    existingRapport
      ? existingRapport.date.split('T')[0]
      : new Date().toISOString().split('T')[0],
  );
  const [siteId, setSiteId] = useState(existingRapport?.siteId ?? '');
  const [saving, setSaving] = useState(false);

  const [lignes, setLignes] = useState<LigneLocal[]>(() =>
    existingRapport?.lignes.map((l) => ({
      tempId: l.id,
      codeVehicule: l.codeVehicule,
      immatriculation: l.immatriculation ?? '',
      categorie: l.categorie,
      statut: l.statut,
      typesPannes: l.typesPannes,
      description: l.description ?? '',
    })) ?? [],
  );

  const { data: sitesData } = useQuery({
    queryKey: ['sites', 'list'],
    queryFn: () => getAllSites(),
  });

  const sites = sitesData?.success ? sitesData.data : [];
  const selectedSite = sites.find((s) => s.id === siteId);

  const lignesByCategorie = useMemo(() => {
    const groups = {} as Record<CategorieVehicule, LigneLocal[]>;
    for (const cat of ALL_CATEGORIES) groups[cat] = [];
    for (const l of lignes) groups[l.categorie].push(l);
    return groups;
  }, [lignes]);

  const usedCategories = ALL_CATEGORIES.filter(
    (c) => lignesByCategorie[c].length > 0,
  );
  const unusedCategories = ALL_CATEGORIES.filter(
    (c) => lignesByCategorie[c].length === 0,
  );

  const addLigne = useCallback(
    (l: LigneLocal) => setLignes((prev) => [...prev, l]),
    [],
  );
  const editLigne = useCallback(
    (tempId: string, updated: LigneLocal) =>
      setLignes((prev) =>
        prev.map((l) => (l.tempId === tempId ? { ...updated, tempId } : l)),
      ),
    [],
  );
  const deleteLigne = useCallback(
    (tempId: string) => setLignes((prev) => prev.filter((l) => l.tempId !== tempId)),
    [],
  );

  const handleSave = async () => {
    if (!siteId) { toast.error('Veuillez sélectionner un site'); return; }
    if (!date) { toast.error('Veuillez saisir une date'); return; }
    setSaving(true);
    try {
      const result = await createRapport({
        date,
        siteId,
        lignes: lignes.map((l) => ({
          codeVehicule: l.codeVehicule,
          immatriculation: l.immatriculation || undefined,
          categorie: l.categorie,
          statut: l.statut,
          typesPannes: l.typesPannes,
          description: l.description || undefined,
        })),
      });
      if (!result.success) { toast.error(result.error); return; }
      toast.success('Rapport créé avec succès !');
      queryClient.invalidateQueries({ queryKey: ['rapports'] });
      router.push('/rapports');
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de navigation */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center gap-3">
          <Link
            href="/rapports"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {existingRapport ? 'Modifier le rapport' : 'Nouveau rapport journalier'}
            </p>
            {selectedSite && (
              <p className="text-xs text-gray-500 truncate">
                RAPPORT — {selectedSite.nom.toUpperCase()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none hidden sm:block"
            />
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none hidden sm:block"
            >
              <option value="">— Site —</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom}
                </option>
              ))}
            </select>
            <button
              onClick={handleSave}
              disabled={saving || !siteId}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </span>
            </button>
          </div>
        </div>

        {/* Ligne 2 mobile: date + site */}
        <div className="sm:hidden flex gap-2 px-4 pb-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <select
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="">— Site —</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenu */}
      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne véhicules */}
        <div className="lg:col-span-2 space-y-4">
          {/* Catégories avec des véhicules */}
          {usedCategories.map((cat) => (
            <CategorySection
              key={cat}
              categorie={cat}
              lignes={lignesByCategorie[cat]}
              onAdd={addLigne}
              onEdit={editLigne}
              onDelete={deleteLigne}
            />
          ))}

          {/* Catégories vides — dans un accordéon */}
          {unusedCategories.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 select-none py-2 transition">
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                <span className="font-medium">
                  Autres catégories ({unusedCategories.length})
                </span>
              </summary>
              <div className="mt-3 space-y-3 pl-2">
                {unusedCategories.map((cat) => (
                  <CategorySection
                    key={cat}
                    categorie={cat}
                    lignes={[]}
                    onAdd={addLigne}
                    onEdit={editLigne}
                    onDelete={deleteLigne}
                  />
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Colonne récap */}
        <div>
          <RecapPanel lignes={lignes} />
        </div>
      </div>
    </div>
  );
}
