"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // adapte le chemin
import { createTechnicien } from "@/service/techniciens/technicien.action";
import {
  createTechnicienSchema,
  CreateTechnicienSchema,
} from "@/service/techniciens/technicien.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";

// ✅ Liste des spécialités corrigée
const specialites = [
  { value: "MECANIQUE_GENERALE", label: "Mécanique générale" },
  { value: "ELECTRICITE_AUTOMOBILE", label: "Électricité automobile" },
  { value: "PNEUMATIQUE", label: "Pneumatique" },
  { value: "DIAGNOSTIC_ELECTRONIQUE", label: "Diagnostic électronique" },
  { value: "CLIMATISATION", label: "Climatisation" },
  { value: "SYSTEME_FREINAGE", label: "Freinage" },
  { value: "TRANSMISSION", label: "Transmission" },
  { value: "HYDRAULIQUE", label: "Hydraulique" },
  { value: "CARROSSERIE", label: "Carrosserie" },
  { value: "PEINTURE", label: "Peinture" },
];

const AjouterTechnicienDialog = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTechnicienSchema>({
    resolver: zodResolver(createTechnicienSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      statut: "ACTIF",
      specialite: "",
    },
  });

  const onSubmit = async (data: CreateTechnicienSchema) => {
    const payload: CreateTechnicienSchema = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone || "",
      statut: data.statut.toUpperCase(),
      specialite: data.specialite.toUpperCase(),
    };

    const result = await createTechnicien(payload);

    if (!result.success) {
      toast("❌ " + result.error);
    } else {
      toast("✅ Technicien créé avec succès !");
      form.reset();
      setOpen(false); // ✅ fermeture du dialog après succès
    }
  };

  return (
   <div className="flex justify-between">
<div>
    gestion des tecniciens
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Nom */}
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="border p-2 w-full rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prénom */}
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="border p-2 w-full rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input
                      type="email"
                      {...field}
                      className="border p-2 w-full rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Téléphone */}
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="border p-2 w-full rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Spécialité */}
            <FormField
              control={form.control}
              name="specialite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spécialité</FormLabel>
                  <FormControl>
                    <select {...field} className="border p-2 w-full rounded">
                      <option value="">-- Sélectionnez une spécialité --</option>
                      {specialites.map((spec) => (
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
                className="bg-green-600 text-white px-4 py-2 rounded"
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

export default AjouterTechnicienDialog;
