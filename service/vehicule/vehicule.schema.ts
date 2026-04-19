import { z } from "zod";


export const createVehiculeSchema = z.object({
  
  nom: z
    .string()
    .min(1, { message: "Le nom du véhicule est obligatoire" }),
  
  numero_de_plaque: z
    .string()
    .min(1, { message: "Le numéro de plaque est obligatoire" }),
  
  annee: z
    .coerce.number({
     message:"L'année du véhicule est obligatoire"
    })
    .min(1900, { message: "L'année doit être supérieure à 1900" })
    .max(2030, { message: "L'année ne peut pas dépasser 2030" }),
  
  type: z.string(
    ).min(1, { message: "Le type de véhicule est obligatoire" }
  ).toUpperCase(),
  
  modele: z
    .string()
    .min(1, { message: "Le modèle du véhicule est obligatoire" }),
  
  statut: z.string(
    ).min(1, { message: "Le statut est obligatoire" }
  ).toUpperCase(),

  siteId: z.string().optional(),
});

// ✅ Type inferé pour TypeScript
export type CreateVehiculeSchema = z.infer<typeof createVehiculeSchema>;
