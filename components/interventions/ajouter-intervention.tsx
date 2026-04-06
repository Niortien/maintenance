"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createIntervention } from "@/service/interventions/interventions.action";
import {
  createInterventionSchema,
  CreateInterventionType,
} from "@/service/interventions/interventions.schema";
import { getAllTechniciens } from "@/service/techniciens/technicien.action";
import { ITechnicien } from "@/service/techniciens/types/technicien.type";
import { IVehicule } from "@/service/vehicule/types/vehicule.type";
import { getAllVehicule } from "@/service/vehicule/vehicule.action";
import { Button } from "../ui/button";

const AjouterInterventionDialog = () => {
  const [open, setOpen] = useState(false);
  const [techniciens, setTechniciens] = useState<ITechnicien[]>([]);
  const [vehicules, setVehicules] = useState<IVehicule[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateInterventionType>({
    resolver: zodResolver(createInterventionSchema),
    defaultValues: {
      date: "",
      description: "",
      situation: "",
      designation: "",
      priorite: "MOYENNE",
      cout: 1,
      temps_estime_heures: 1,
      temps_reel_heures: undefined,
      pieces_utilisees: "",
      notes_additionnelles: "",
      statut: "EN_COURS",
      vehiculeId: "",
      technicienId: "",
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const resTech = await getAllTechniciens();
      const resVeh = await getAllVehicule();

      if (resTech.success) setTechniciens(resTech.data);
      else toast.error("Erreur lors du chargement des techniciens");

      if (resVeh.success) setVehicules(resVeh.data);
      else toast.error("Erreur lors du chargement des véhicules");
    } catch {
      toast.error("Erreur serveur inattendue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<CreateInterventionType> = async (data) => {
    try {
      const result = await createIntervention(data);
      if (!result.success) {
        toast.error("❌ " + result.error);
        return;
      }

      toast.success("✅ Intervention créée avec succès !");
      form.reset();
      setOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error("Erreur : " + err.message);
      else toast.error("Erreur inconnue lors de la création");
    }
  };

  return (
    <div className="flex justify-between">
      <div className="text-5xl text-orange-800 font-bold">
        Gestion des interventions
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-blue-600 text-white px-4 py-2 border-2 border-amber-300 rounded"
            disabled={loading}
          >
            {loading ? "Chargement..." : "+ Ajouter Intervention"}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter une intervention</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer une nouvelle intervention.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <p className="text-center text-gray-500 py-6">
              Chargement des données...
            </p>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <input
                          type="date"
                          {...field}
                          className="border p-2 w-full rounded"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="border p-2 w-full rounded"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="situation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Situation</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="border p-2 w-full rounded"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Désignation</FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          {...field}
                          className="border p-2 w-full rounded"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="priorite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priorité</FormLabel>
                      <FormControl>
                        <select {...field} className="border p-2 w-full rounded">
                          <option value="FAIBLE">FAIBLE</option>
                          <option value="MOYENNE">MOYENNE</option>
                          <option value="URGENTE">URGENTE</option>
                          <option value="ELEVEE">ELEVEE</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="cout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coût (€)</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          {...field}
                          className="border p-2 w-full rounded"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="temps_estime_heures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temps estimé (heures)</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          min="1"
                          step="0.5"
                          {...field}
                          className="border p-2 w-full rounded"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="vehiculeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Véhicule</FormLabel>
                      <FormControl>
                        <select {...field} className="border p-2 w-full rounded">
                          <option value="">
                            -- Sélectionner un véhicule --
                          </option>
                          {vehicules.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.nom} - {v.numero_de_plaque}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="technicienId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technicien</FormLabel>
                      <FormControl>
                        <select {...field} className="border p-2 w-full rounded">
                          <option value="">
                            -- Sélectionner un technicien --
                          </option>
                          {techniciens.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.nom} {t.prenom}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? "En cours..."
                      : "Créer"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AjouterInterventionDialog;
