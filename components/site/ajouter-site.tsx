'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, MapPin } from 'lucide-react';

import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createSite } from '@/service/site/site.action';
import { CreateSiteSchema, createSiteSchema } from '@/service/site/site.schema';
import { getAllTechniciens } from '@/service/techniciens/technicien.action';

const AjouterSiteDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: techData } = useQuery({
    queryKey: ['techniciens', 'list'],
    queryFn: () => getAllTechniciens(),
    enabled: open,
  });
  const techniciens = techData?.success ? techData.data : [];

  const form = useForm<CreateSiteSchema>({
    resolver: zodResolver(createSiteSchema),
    defaultValues: { nom: '', code: '', region: '', responsableId: '' },
  });

  const onSubmit = async (data: CreateSiteSchema) => {
    const payload = { ...data, responsableId: data.responsableId || undefined };
    const result = await createSite(payload);
    if (!result.success) {
      toast.error('❌ ' + result.error);
    } else {
      toast.success('✅ Site créé avec succès !');
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['sites', 'list'] });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
            <PlusCircle className="h-4 w-4" />
            Ajouter un site
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              Nouveau site
            </DialogTitle>
            <DialogDescription>Renseignez les informations du nouveau site.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="nom" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du site</FormLabel>
                  <FormControl><Input placeholder="ex: Yamoussoukro" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl><Input placeholder="ex: LVS" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="region" render={({ field }) => (
                <FormItem>
                  <FormLabel>Région (optionnel)</FormLabel>
                  <FormControl><Input placeholder="ex: Centre" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="responsableId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsable du site (optionnel)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Sélectionner un technicien responsable" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Aucun responsable</SelectItem>
                      {techniciens.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.nom} {t.prenom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Création...' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AjouterSiteDialog;
