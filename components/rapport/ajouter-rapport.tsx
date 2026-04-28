'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, FileText, Plus, Trash2 } from 'lucide-react';

import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createRapport } from '@/service/rapport/rapport.action';
import { CreateRapportSchema, createRapportSchema } from '@/service/rapport/rapport.schema';
import { getAllSites } from '@/service/site/site.action';

const CATEGORIES = ['TASSEUR','BP','AMPLIROLL','TRACTEUR','KIA','VOITURETTE','PC','MOTO_TRICYCLE','KB'] as const;
const STATUTS = ['OPERATIONNEL','EN_PANNE','ACCIDENTE','EN_ATTENTE'] as const;
const TYPES_PANNES = ['MECANIQUE','AIR','ELECTRICITE','SOUDURE','HYDRAULIQUE','PNEUMATIQUE','POMPE_INJECTION','PNEU','CARROSSERIE','AUTRE'] as const;

const AjouterRapportDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: sitesData } = useQuery({
    queryKey: ['sites', 'list'],
    queryFn: () => getAllSites(),
    enabled: open,
  });

  const sites = sitesData?.success ? sitesData.data : [];

  const form = useForm<CreateRapportSchema>({
    resolver: zodResolver(createRapportSchema),
    defaultValues: { date: new Date().toISOString().split('T')[0], siteId: '', lignes: [] },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lignes' });

  const onSubmit = async (data: CreateRapportSchema) => {
    const result = await createRapport(data);
    if (!result.success) {
      toast.error('❌ ' + result.error);
    } else {
      toast.success('✅ Rapport créé avec succès !');
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['rapports', 'list'] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
          <PlusCircle className="h-4 w-4" />
          Nouveau rapport
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            Nouveau rapport journalier
          </DialogTitle>
          <DialogDescription>Créez un rapport de situation logistique pour un site.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="siteId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Site</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Sélectionner un site" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sites.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.nom} ({s.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Lignes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Véhicules</h4>
                <Button type="button" size="sm" variant="outline" className="gap-1" onClick={() =>
                  append({ codeVehicule: '', immatriculation: '', categorie: 'TASSEUR', statut: 'OPERATIONNEL', typesPannes: [], description: '' })
                }>
                  <Plus className="h-3 w-3" /> Ajouter véhicule
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-xl p-4 space-y-3 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Véhicule {index + 1}</span>
                    <Button type="button" size="icon" variant="ghost" onClick={() => remove(index)}
                      className="h-6 w-6 text-red-500 hover:bg-red-50">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name={`lignes.${index}.codeVehicule`} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Code</FormLabel>
                        <FormControl><Input placeholder="ex: T58" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`lignes.${index}.immatriculation`} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Immatriculation</FormLabel>
                        <FormControl><Input placeholder="ex: 5985KT" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`lignes.${index}.categorie`} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Catégorie</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`lignes.${index}.statut`} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Statut</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>{STATUTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name={`lignes.${index}.description`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Description panne (optionnel)</FormLabel>
                      <FormControl><Input placeholder="ex: Problème de pompe à injection" {...field} /></FormControl>
                    </FormItem>
                  )} />

                  <div>
                    <p className="text-xs font-medium mb-2 text-slate-600">Types de pannes</p>
                    <div className="flex flex-wrap gap-2">
                      {TYPES_PANNES.map((type) => {
                        const current = form.watch(`lignes.${index}.typesPannes`) ?? [];
                        const checked = current.includes(type);
                        return (
                          <button key={type} type="button"
                            className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                              checked ? 'bg-orange-100 border-orange-400 text-orange-700' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                            }`}
                            onClick={() => {
                              const updated = checked ? current.filter((t) => t !== type) : [...current, type];
                              form.setValue(`lignes.${index}.typesPannes`, updated as typeof TYPES_PANNES[number][]);
                            }}>
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white"
                disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Création...' : 'Créer le rapport'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AjouterRapportDialog;
