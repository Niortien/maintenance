import { z } from "zod";

export const PrioriteEnum = z.enum(["FAIBLE", "MOYENNE", "URGENTE","ELEVEE"]);
export const StatutInterventionEnum = z.enum(["EN_COURS", "TERMINEE", "ANNULEE"]);

export const createInterventionSchema = z.object({
  date: z
    .string()
    .min(1, { message: "La date est obligatoire" })
    .transform((val) => {
      const parsed = new Date(val);
      return !isNaN(parsed.getTime()) ? parsed.toISOString() : val;
    }),

  description: z.string().min(1, { message: "La description est obligatoire" }),
 designation: z.string().nonempty("La désignation est requise"),
  situation: z.string().min(1, { message: "La situation est obligatoire" }),
  priorite: PrioriteEnum,

  // ✅ conversion automatique string -> number
  cout: z.coerce.number().min(1, { message: "Le coût est obligatoire" }),
  temps_estime_heures: z.coerce.number().min(1, { message: "Le temps estimé est obligatoire" }),
  temps_reel_heures: z.coerce.number().optional(),

  pieces_utilisees: z.string().optional(),
  notes_additionnelles: z.string().optional(),
  statut: StatutInterventionEnum,

  vehiculeId: z.string().min(1, { message: "L'ID du véhicule est obligatoire" }),
  technicienId: z.string().min(1, { message: "L'ID du technicien est obligatoire" }),
});

export type CreateInterventionType = z.infer<typeof createInterventionSchema>;
