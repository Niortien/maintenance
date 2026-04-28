'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';

import { getAllSites } from '@/service/site/site.action';
import { ISite } from '@/service/site/types/site.type';
import SiteCard from './site-card';

const SiteList = () => {
  const [sites, setSites] = useState<ISite[]>([]);

  const { isPending, error, data } = useQuery({
    queryKey: ['sites', 'list'],
    queryFn: () => getAllSites(),
  });

  React.useEffect(() => {
    if (data?.success && data.data) setSites(data.data);
  }, [data]);

  React.useEffect(() => {
    if (error) toast.error('Erreur lors du chargement des sites');
    else if (data && !data.success) toast.error(data.error);
  }, [error, data]);

  const handleDelete = (id: string) => setSites((prev) => prev.filter((s) => s.id !== id));
  const handleUpdate = (updated: ISite) =>
    setSites((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

  if (isPending)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );

  if (!isPending && sites.length === 0)
    return (
      <div className="text-center py-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600">
        <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Aucun site disponible</p>
        <p className="text-slate-500 mt-1">Créez votre premier site logistique</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} onDelete={handleDelete} onUpdate={handleUpdate} />
      ))}
    </div>
  );
};

export default SiteList;
