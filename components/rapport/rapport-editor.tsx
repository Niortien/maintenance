'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Save, ArrowLeft, AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { getMyEquipements } from '@/service/equipement/equipement.action';
import { getProfile } from '@/service/auth/auth.action';
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

// Category display order in the report
const CAT_ORDER: CategorieVehicule[] = [
  'TASSEUR', 'AMPLIROLL', 'BP', 'TRACTEUR', 'KIA', 'VOITURETTE', 'MOTO_TRICYCLE', 'PC', 'KB',
];

// Extra manual categories (not in IEquipement but valid in rapport)
const EXTRA_CATEGORIES: CategorieVehicule[] = ['PC', 'KB'];

const STATUT_CONFIG: Record<
  StatutVehiculeRapport,
  { label: string; color: string; activeBorder: string; dot: string }
> = {
  OPERATIONNEL: {
    label: 'Opérationnel',
    color: 'bg-emerald-100 text-emerald-700',
    activeBorder: 'border-emerald-400',
    dot: 'bg-emerald-500',
  },
  EN_PANNE: {
    label: 'En panne',
    color: 'bg-red-100 text-red-700',
    activeBorder: 'border-red-400',
    dot: 'bg-red-500',
  },
  ACCIDENTE: {
    label: 'Accidenté',
    color: 'bg-orange-100 text-orange-700',
    activeBorder: 'border-orange-400',
    dot: 'bg-orange-500',
  },
  EN_ATTENTE: {
    label: 'En attente',
    color: 'bg-amber-100 text-amber-700',
    activeBorder: 'border-amber-400',
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

const ALL_STATUTS: StatutVehiculeRapport[] = [
  'OPERATIONNEL', 'EN_PANNE', 'ACCIDENTE', 'EN_ATTENTE',
];

const ALL_TYPES_PANNES: TypePanne[] = [
  'MECANIQUE', 'AIR', 'ELECTRICITE', 'SOUDURE', 'HYDRAULIQUE',
  'PNEUMATIQUE', 'POMPE_INJECTION', 'PNEU', 'CARROSSERIE', 'AUTRE',
];

// ─── Type local ───────────────────────────────────────────────────────────────

type LigneState = {
  key: string;
  codeVehicule: string;
  immatriculation: string;
  categorie: CategorieVehicule;
  statut: StatutVehiculeRapport;
  typesPannes: TypePanne[];
  description: string;
  isManual?: boolean;
};

function mkId() {
  return Math.random().toString(36).slice(2);
}

// ─── Ligne équipement ─────────────────────────────────────────────────────────

function EquipementRow({
  ligne,
  onUpdate,
  onRemove,
}: {
  ligne: LigneState;
  onUpdate: (patch: Partial<LigneState>) => void;
  onRemove?: () => void;
}) {
  const isPanne = ligne.statut !== 'OPERATIONNEL';

  function toggleType(t: TypePanne) {
    const cur = ligne.typesPannes;
    onUpdate({ typesPannes: cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t] });
  }

  return (
    <div
      className={`rounded-xl border p-3.5 transition-all ${
        isPanne
          ? 'border-red-200 bg-red-50/30'
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${STATUT_CONFIG[ligne.statut].dot}`}
        />
        <div className="flex-1 min-w-0">
          {/* Code + immat */}
          {ligne.isManual ? (
            <div className="flex items-center gap-2 mb-2">
              <input
                className="font-mono font-bold text-sm text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-emerald-500 focus:outline-none uppercase w-28"
                placeholder="ex: PC1477"
                value={ligne.codeVehicule}
                onChange={(e) => onUpdate({ codeVehicule: e.target.value.toUpperCase() })}
              />
              <input
                className="text-xs text-gray-400 font-mono bg-transparent border-b border-dashed border-gray-200 focus:border-emerald-400 focus:outline-none uppercase w-24"
                placeholder="immat."
                value={ligne.immatriculation}
                onChange={(e) => onUpdate({ immatriculation: e.target.value.toUpperCase() })}
              />
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="ml-auto p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono font-bold text-sm text-gray-900">
                {ligne.codeVehicule}
              </span>
              {ligne.immatriculation && (
                <span className="text-xs text-gray-400 font-mono">
                  ({ligne.immatriculation})
                </span>
              )}
            </div>
          )}

          {/* Status selector */}
          <div className="flex gap-1.5 flex-wrap">
            {ALL_STATUTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onUpdate({ statut: s, typesPannes: [], description: '' })}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                  ligne.statut === s
                    ? `${STATUT_CONFIG[s].color} ${STATUT_CONFIG[s].activeBorder}`
                    : 'border-gray-200 text-gray-400 hover:border-gray-300 bg-white'
                }`}
              >
                {STATUT_CONFIG[s].label}
              </button>
            ))}
          </div>

          {/* Panne details */}
          {isPanne && (
            <div className="mt-3 space-y-2.5">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1.5">
                  Types de pannes
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TYPES_PANNES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleType(t)}
                      className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${
                        ligne.typesPannes.includes(t)
                          ? 'bg-red-100 border-red-400 text-red-700 font-medium'
                          : 'border-gray-300 text-gray-400 hover:bg-gray-50 bg-white'
                      }`}
                    >
                      {TYPES_PANNES_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Raison / Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={ligne.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="Décrivez le problème…"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section catégorie ────────────────────────────────────────────────────────

function CategorySection({
  categorie,
  lignes,
  onUpdate,
  onRemove,
  onAddManual,
}: {
  categorie: CategorieVehicule;
  lignes: LigneState[];
  onUpdate: (key: string, patch: Partial<LigneState>) => void;
  onRemove: (key: string) => void;
  onAddManual?: () => void;
}) {
  const ops = lignes.filter((l) => l.statut === 'OPERATIONNEL').length;
  const total = lignes.length;
  const isExtraCategory = EXTRA_CATEGORIES.includes(categorie);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-gray-800 uppercase tracking-wide">
            {CATEGORIE_LABELS[categorie]}
          </span>
          {total > 0 && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                ops === total
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {ops}/{total}
            </span>
          )}
        </div>
        {(isExtraCategory || onAddManual) && (
          <button
            type="button"
            onClick={onAddManual}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter
          </button>
        )}
      </div>

      <div className="p-3 space-y-2">
        {total === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4 italic">
            {isExtraCategory
              ? 'Cliquez sur Ajouter pour saisir un équipement'
              : 'Aucun équipement'}
          </p>
        ) : (
          lignes.map((ligne) => (
            <EquipementRow
              key={ligne.key}
              ligne={ligne}
              onUpdate={(patch) => onUpdate(ligne.key, patch)}
              onRemove={ligne.isManual ? () => onRemove(ligne.key) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Panel récapitulatif ──────────────────────────────────────────────────────

function RecapPanel({ lignes }: { lignes: LigneState[] }) {
  const byCategorie = useMemo(() => {
    const g: Partial<Record<CategorieVehicule, LigneState[]>> = {};
    for (const l of lignes) {
      if (!g[l.categorie]) g[l.categorie] = [];
      g[l.categorie]!.push(l);
    }
    return g;
  }, [lignes]);

  const pannes = useMemo(
    () => lignes.filter((l) => l.statut !== 'OPERATIONNEL'),
    [lignes],
  );

  const usedCats = CAT_ORDER.filter((c) => (byCategorie[c]?.length ?? 0) > 0);

  return (
    <div className="space-y-4 sticky top-20">
      {/* Récapitulatif */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Récapitulatif
        </h3>
        {usedCats.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-2 italic">
            Aucun équipement
          </p>
        ) : (
          <div className="space-y-1">
            {usedCats.map((cat) => {
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
            Hors service ({pannes.length})
          </h3>
          <div className="space-y-2">
            {pannes.map((l) => (
              <div
                key={l.key}
                className="pb-2 border-b border-red-100 last:border-0 last:pb-0"
              >
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-mono font-bold text-sm text-red-800">
                    {l.codeVehicule || '—'}
                  </span>
                  {l.immatriculation && (
                    <span className="text-xs text-red-400 font-mono">
                      ({l.immatriculation})
                    </span>
                  )}
                  <span
                    className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUT_CONFIG[l.statut].color}`}
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
  const [saving, setSaving] = useState(false);
  const [lignes, setLignes] = useState<LigneState[]>(() => {
    if (!existingRapport) return [];
    return existingRapport.lignes.map((l) => ({
      key: l.id,
      codeVehicule: l.codeVehicule,
      immatriculation: l.immatriculation ?? '',
      categorie: l.categorie,
      statut: l.statut,
      typesPannes: l.typesPannes,
      description: l.description ?? '',
    }));
  });
  const [equipInitialized, setEquipInitialized] = useState(!!existingRapport);

  // Fetch equipment (only for new rapport)
  const { data: equipData, isLoading: equipLoading } = useQuery({
    queryKey: ['equipements', 'my'],
    queryFn: () => getMyEquipements(),
    enabled: !existingRapport,
  });

  // Fetch profile for site info
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    enabled: !existingRapport,
  });

  const equipements = equipData?.success ? equipData.data : [];
  const profile = profileData?.success ? profileData.data : null;

  // Initialize lignes from equipment once loaded
  useEffect(() => {
    if (equipInitialized || equipLoading || !equipData?.success) return;
    const initial: LigneState[] = equipData.data.map((e) => ({
      key: e.id,
      codeVehicule: e.nom,
      immatriculation: e.immatriculation ?? '',
      categorie: e.categorie as CategorieVehicule,
      statut: 'OPERATIONNEL' as StatutVehiculeRapport,
      typesPannes: [],
      description: '',
    }));
    setLignes(initial);
    setEquipInitialized(true);
  }, [equipData, equipLoading, equipInitialized]);

  // Derived site info
  const siteId =
    existingRapport?.siteId ?? profile?.site?.id ?? equipements[0]?.siteId ?? '';
  const siteName = existingRapport?.site?.nom ?? profile?.site?.nom ?? '';

  // Group by category
  const byCategorie = useMemo(() => {
    const g = {} as Record<CategorieVehicule, LigneState[]>;
    for (const c of CAT_ORDER) g[c] = [];
    for (const l of lignes) g[l.categorie].push(l);
    return g;
  }, [lignes]);

  const usedCategories = CAT_ORDER.filter((c) => byCategorie[c].length > 0);
  const extraCategories = EXTRA_CATEGORIES.filter((c) => !usedCategories.includes(c));

  // Handlers
  function handleUpdate(key: string, patch: Partial<LigneState>) {
    setLignes((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  }

  function handleRemove(key: string) {
    setLignes((prev) => prev.filter((l) => l.key !== key));
  }

  function handleAddManual(categorie: CategorieVehicule) {
    setLignes((prev) => [
      ...prev,
      {
        key: mkId(),
        codeVehicule: '',
        immatriculation: '',
        categorie,
        statut: 'EN_PANNE',
        typesPannes: [],
        description: '',
        isManual: true,
      },
    ]);
  }

  // Save
  const handleSave = async () => {
    if (!siteId) {
      toast.error('Impossible de déterminer le site');
      return;
    }
    if (!date) {
      toast.error('Veuillez saisir une date');
      return;
    }
    const missing = lignes.filter(
      (l) => l.statut !== 'OPERATIONNEL' && !l.description.trim(),
    );
    if (missing.length > 0) {
      toast.error(
        `Description manquante pour : ${missing.map((l) => l.codeVehicule || '(sans code)').join(', ')}`,
      );
      return;
    }
    const missingCode = lignes.filter((l) => l.isManual && !l.codeVehicule.trim());
    if (missingCode.length > 0) {
      toast.error("Certains équipements ajoutés manuellement n'ont pas de code");
      return;
    }

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
      if (!result.success) {
        toast.error(result.error);
        return;
      }
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
            {siteName && (
              <p className="text-xs text-gray-500 truncate">
                RAPPORT — {siteName.toUpperCase()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <button
              onClick={handleSave}
              disabled={saving || !siteId}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Enregistrement…' : 'Enregistrer'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {equipLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : equipements.length === 0 && !existingRapport && equipInitialized ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <AlertCircle className="h-10 w-10 text-amber-500" />
            <p className="text-gray-600 font-medium">
              Aucun équipement trouvé pour votre site
            </p>
            <p className="text-sm text-gray-400">
              Ajoutez des équipements avant de créer un rapport
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne équipements */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
                <p className="text-sm text-blue-800 font-medium">
                  Sélectionnez le statut de chaque équipement.
                  Par défaut, tous sont <strong>opérationnels</strong>.
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Pour les équipements <strong>en panne</strong>,{' '}
                  <strong>accidentés</strong> ou <strong>en attente</strong>,
                  cochez le statut et ajoutez une description obligatoire.
                </p>
              </div>

              {/* Categories from equipment DB */}
              {usedCategories.map((cat) => (
                <CategorySection
                  key={cat}
                  categorie={cat}
                  lignes={byCategorie[cat]}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                  onAddManual={
                    EXTRA_CATEGORIES.includes(cat)
                      ? () => handleAddManual(cat)
                      : undefined
                  }
                />
              ))}

              {/* Extra categories (PC / KB) always available */}
              {extraCategories.map((cat) => (
                <CategorySection
                  key={cat}
                  categorie={cat}
                  lignes={[]}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                  onAddManual={() => handleAddManual(cat)}
                />
              ))}

              {/* Bouton de soumission en bas */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={saving || !siteId}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                  <Save className="h-5 w-5" />
                  <span>{saving ? 'Enregistrement en cours…' : 'Enregistrer le rapport'}</span>
                </button>
              </div>
            </div>

            {/* Colonne récap */}
            <div>
              <RecapPanel lignes={lignes} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
