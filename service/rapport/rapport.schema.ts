import { z } from 'zod';

export const CategorieVehiculeEnum = z.enum([
  'TASSEUR',
  'BP',
  'AMPLIROLL',
  'TRACTEUR',
  'KIA',
  'VOITURETTE',
  'PC',
  'MOTO_TRICYCLE',
  'KB',
]);

export const StatutVehiculeRapportEnum = z.enum([
  'OPERATIONNEL',
  'EN_PANNE',
  'ACCIDENTE',
  'EN_ATTENTE',
]);

export const TypePanneEnum = z.enum([
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
]);

export const createLigneRapportSchema = z.object({
  codeVehicule: z.string().min(1, { message: 'Le code véhicule est obligatoire' }),
  immatriculation: z.string().optional(),
  categorie: CategorieVehiculeEnum,
  statut: StatutVehiculeRapportEnum,
  typesPannes: z.array(TypePanneEnum).optional().default([]),
  description: z.string().optional(),
});

export const createRapportSchema = z.object({
  date: z
    .string()
    .min(1, { message: 'La date est obligatoire' })
    .transform((val) => {
      const parsed = new Date(val);
      return !isNaN(parsed.getTime()) ? parsed.toISOString() : val;
    }),
  siteId: z.string().min(1, { message: "L'ID du site est obligatoire" }),
  lignes: z.array(createLigneRapportSchema).optional().default([]),
});

export type CreateLigneRapportSchema = z.infer<typeof createLigneRapportSchema>;
export type CreateRapportSchema = z.infer<typeof createRapportSchema>;
