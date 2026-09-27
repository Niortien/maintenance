import { z } from 'zod';

export const TypeConsommableEnum = z.enum(['HUILE_MOTEUR', 'HUILE_VERIN', 'PNEU', 'BATTERIE']);

export const TYPE_CONSOMMABLE_LABELS: Record<z.infer<typeof TypeConsommableEnum>, string> = {
  HUILE_MOTEUR: 'Huile de moteur',
  HUILE_VERIN: 'Huile de vérin',
  PNEU: 'Pneus',
  BATTERIE: 'Batteries',
};

export const createRepartitionSchema = z.object({
  date: z
    .string()
    .min(1, { message: 'La date est obligatoire' })
    .transform((val) => {
      const parsed = new Date(val);
      return !isNaN(parsed.getTime()) ? parsed.toISOString() : val;
    }),
  type: TypeConsommableEnum,
  designation: z.string().optional(),
  quantite: z.coerce.number().min(0.01, { message: 'La quantité doit être supérieure à 0' }),
  prixUnitaireAchat: z.coerce.number().min(0, { message: "Le prix d'achat est obligatoire" }),
  prixUnitaireVente: z.coerce.number().min(0, { message: 'Le prix de vente est obligatoire' }),
  fournisseur: z.string().optional(),
  vehiculeId: z.string().optional(),
});

export type CreateRepartitionSchema = z.infer<typeof createRepartitionSchema>;
