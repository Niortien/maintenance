import { z } from 'zod';

export const createBesoinSchema = z.object({
  designation: z.string().min(1, 'La désignation est obligatoire'),
  quantite: z.coerce.number().min(0, 'La quantité doit être ≥ 0'),
  prixUnitaire: z.coerce.number().min(0, 'Le prix doit être ≥ 0'),
});

export const createSituationSchema = z.object({
  equipementId: z.string().min(1, "L'équipement est obligatoire"),
  description: z.string().min(10, 'La description doit faire au moins 10 caractères'),
});

export type CreateSituationSchema = z.infer<typeof createSituationSchema>;
export type CreateBesoinSchema = z.infer<typeof createBesoinSchema>;
