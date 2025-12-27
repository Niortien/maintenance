"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // adapte le chemin
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createVehicule } from "@/service/vehicule/vehicule.action";
import {
  createVehiculeSchema,
  CreateVehiculeSchema,
} from "@/service/vehicule/vehicule.schema";
import { Button } from "../ui/button";

// ✅ Liste des spécialités corrigée
const typeVehicule = [
  { value: "CAMINON", label: "CAMINON" },
  { value: "CAMIONNETTE", label: "CAMIONNETTE" },
  { value: "VOITURE", label: "VOITURE" },
  { value: "EQUIPEMENT", label: "EQUIPEMENT" },
];

const AjouterVehiculeDialog = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateVehiculeSchema>({
    resolver: zodResolver(createVehiculeSchema),
    defaultValues: {
      nom: "",
      modele: "",
      annee: 2020,
      numero_de_plaque: "",
      statut: "ACTIF",
      type: "",
    },
  });

  const onSubmit = async (data: CreateVehiculeSchema) => {
    const payload: CreateVehiculeSchema = {
      nom: data.nom,
      modele: data.modele,
      numero_de_plaque: data.numero_de_plaque,
      annee: data.annee,
      statut: data.statut.toUpperCase(),
      type: data.type.toUpperCase(),
    };

    const result = await createVehicule(payload);

    if (!result.success) {
      toast("❌ " + result.error);
    } else {
      toast("✅ Véhicule créé avec succès !");
      form.reset();
      setOpen(false); // ✅ fermeture du dialog après succès
    }
  };

  return (
    <div className="flex justify-between">
      <div className="text-5xl text-orange-800 font-bold">
        Gestion des vehicules
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 text-white px-4 py-2 border-2 border-amber-300 rounded">
            + Ajouter Technicien
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un technicien</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau technicien.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Nom */}
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <input {...field} className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Modele */}
              <FormField
                control={form.control}
                name="modele"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle</FormLabel>
                    <FormControl>
                      <input {...field} className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="numero_de_plaque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero de plaque</FormLabel>
                    <FormControl>
                      <input
                        type="numero_de_plaque"
                        {...field}
                        className="border p-2 w-full rounded"
                        placeholder="AA-H78"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Téléphone */}
              <FormField
                control={form.control}
                name="annee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année</FormLabel>
                    <FormControl>
                      <input {...field} className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Spécialité */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de vehicule</FormLabel>
                    <FormControl>
                      <select {...field} className="border p-2 w-full rounded">
                        <option value="">
                          -- Sélectionnez une spécialité --
                        </option>
                        {typeVehicule.map((spec) => (
                          <option key={spec.value} value={spec.value}>
                            {spec.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Statut */}
              <FormField
                control={form.control}
                name="statut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <FormControl>
                      <select {...field} className="border p-2 w-full rounded">
                        <option value="ACTIF">Actif</option>
                        <option value="INACTIF">Inactif</option>
                        <option value="EN_MAINTENANCE">En Maitenance</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  {form.formState.isSubmitting ? "En cours..." : "Créer"}
                </button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AjouterVehiculeDialog;
