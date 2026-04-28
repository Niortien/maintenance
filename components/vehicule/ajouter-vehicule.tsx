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
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getAllSites } from "@/service/site/site.action";
import { PlusCircle } from "lucide-react";

const typeVehicule = [
  { value: "CAMINON", label: "CAMINON" },
  { value: "CAMIONNETTE", label: "CAMIONNETTE" },
  { value: "VOITURE", label: "VOITURE" },
  { value: "EQUIPEMENT", label: "EQUIPEMENT" },
];

const AjouterVehiculeDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: sitesData } = useQuery({
    queryKey: ['sites', 'list'],
    queryFn: () => getAllSites(),
    enabled: open,
  });
  const sites = sitesData?.success ? sitesData.data : [];

  const form = useForm<CreateVehiculeSchema>({
    resolver: zodResolver(createVehiculeSchema),
    defaultValues: {
      nom: "",
      modele: "",
      annee: 2020,
      numero_de_plaque: "",
      statut: "ACTIF",
      type: "",
      siteId: "",
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
      siteId: data.siteId || undefined,
    };

    const result = await createVehicule(payload);

    if (!result.success) {
      toast.error("❌ " + result.error);
    } else {
      toast.success("✅ Véhicule créé avec succès !");
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['vehicules', 'list'] });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="text-5xl text-orange-800 font-bold">
        Gestion des vehicules
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
            <PlusCircle className="h-4 w-4" />
            Ajouter un véhicule
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un véhicule</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau véhicule.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="nom" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl><input {...field} className="border p-2 w-full rounded" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="modele" render={({ field }) => (
                <FormItem>
                  <FormLabel>Modèle</FormLabel>
                  <FormControl><input {...field} className="border p-2 w-full rounded" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="numero_de_plaque" render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de plaque</FormLabel>
                  <FormControl><input {...field} className="border p-2 w-full rounded" placeholder="AA-H78" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="annee" render={({ field }) => (
                <FormItem>
                  <FormLabel>Année</FormLabel>
                  <FormControl><input type="number" min="1900" max="2030" {...field} className="border p-2 w-full rounded" placeholder="2024" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de véhicule</FormLabel>
                  <FormControl>
                    <select {...field} className="border p-2 w-full rounded">
                      <option value="">-- Sélectionnez un type --</option>
                      {typeVehicule.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="statut" render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <FormControl>
                    <select {...field} className="border p-2 w-full rounded">
                      <option value="ACTIF">Actif</option>
                      <option value="INACTIF">Inactif</option>
                      <option value="EN_MAINTENANCE">En Maintenance</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="siteId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Site d&apos;affectation (optionnel)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Sélectionner un site" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Aucun site</SelectItem>
                      {sites.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.nom} ({s.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}
                  className="bg-orange-600 hover:bg-orange-700 text-white">
                  {form.formState.isSubmitting ? "En cours..." : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AjouterVehiculeDialog;