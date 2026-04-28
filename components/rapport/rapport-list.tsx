'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';

import { getAllRapports } from '@/service/rapport/rapport.action';
import { IRapport } from '@/service/rapport/types/rapport.type';
import RapportCard from './rapport-card';
import { Input } from '@/components/ui/input';

const RapportList = () => {
  const [rapports, setRapports] = useState<IRapport[]>([]);
  const [filterDate, setFilterDate] = useState<string>('');

  const { isPending, error, data } = useQuery({
    queryKey: ['rapports', 'list', filterDate],
    queryFn: () => getAllRapports(undefined, filterDate || undefined),
  });

  React.useEffect(() => {
    if (data?.success && data.data) setRapports(data.data);
  }, [data]);

  React.useEffect(() => {
    if (error) toast.error('Erreur lors du chargement des rapports');
    else if (data && !data.success) toast.error(data.error);
  }, [error, data]);

  const handleDelete = (id: string) => setRapports((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="space-y-6">
      {/* Filtre par date */}
      <div className="flex gap-3">
        <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
          className="w-full sm:w-48" placeholder="Filtrer par date" />
      </div>

      {isPending && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
        </div>
      )}

      {!isPending && rapports.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600">
          <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Aucun rapport disponible</p>
          <p className="text-slate-500 mt-1">Créez votre premier rapport journalier</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rapports.map((rapport) => (
          <RapportCard key={rapport.id} rapport={rapport} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default RapportList;
