import { z } from 'zod';

export const createSiteSchema = z.object({
  nom: z.string().min(1, { message: 'Le nom du site est obligatoire' }),
  code: z.string().min(1, { message: 'Le code du site est obligatoire' }).toUpperCase(),
  region: z.string().optional(),
  responsableId: z.string().optional(),
});


export type CreateSiteSchema = z.infer<typeof createSiteSchema>;
