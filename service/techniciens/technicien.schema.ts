import { z } from "zod";

export const createTechnicienSchema = z.object({
  nom: z.string().min(1, { message: "Le nom du technicien est obligatoire" }),
  prenom: z.string().min(1, { message: "Le prénom du technicien est obligatoire" }),
  email: z
    .string()
    .min(1, { message: "L'email est obligatoire" })
    .email({ message: "Email invalide" }),
  telephone: z.string().min(1, { message: "Le numéro de téléphone est obligatoire" }),
  statut: z
    .string()
    .min(1, { message: "Le statut est obligatoire" })
    .transform((val) => val.toUpperCase()),

  // ✅ une seule spécialité en string
  specialite: z
    .string()
    .min(1, { message: "La spécialité est obligatoire" })
    .transform((val) => val.toUpperCase()),
});

// ✅ Type TypeScript auto-généré
export type CreateTechnicienSchema = z.infer<typeof createTechnicienSchema>;
