import { z } from 'zod';

export const CATEGORIES_EQUIPEMENT = [
  'TASSEUR',
  'TRACTEUR',
  'AMPLIROLL',
  'MOTO_TRICYCLE',
  'BP',
  'KIA',
  'VOITURETTE',
] as const;

export const STATUTS_EQUIPEMENT = ['ACTIF', 'EN_MAINTENANCE', 'INACTIF'] as const;

export const CATEGORIES_IMMAT_REQUIRED = ['BP', 'KIA'] as const;

export const CATEGORIE_LABELS: Record<string, string> = {
  TASSEUR: 'Tasseur',
  TRACTEUR: 'Tracteur',
  AMPLIROLL: 'Ampliroll',
  MOTO_TRICYCLE: 'Moto Tricycle',
  BP: 'BP (Benne Polyp.)',
  KIA: 'KIA',
  VOITURETTE: 'Voiturette',
};

export const createEquipementSchema = z
  .object({
    nom: z.string().min(1, 'Le nom est obligatoire'),
    categorie: z.enum(CATEGORIES_EQUIPEMENT, {
      error: () => ({ message: 'Catégorie invalide' }),
    }),
    immatriculation: z.string().optional(),
    statut: z.enum(STATUTS_EQUIPEMENT).default('ACTIF'),
  })
  .superRefine((data, ctx) => {
    if (data.categorie === 'TASSEUR' && !/^T/i.test(data.nom)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nom'],
        message: 'Le nom d\'un TASSEUR doit commencer par T (ex: T50)',
      });
    }
    if (
      (CATEGORIES_IMMAT_REQUIRED as readonly string[]).includes(data.categorie) &&
      !data.immatriculation
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['immatriculation'],
        message: `L'immatriculation est obligatoire pour la catégorie ${data.categorie}`,
      });
    }
  });

export type CreateEquipementSchema = z.infer<typeof createEquipementSchema>;
