import RepartitionIndex from '@/components/repartition/repartition-index';

export const metadata = { title: 'Répartitions — GI2E Maintenance' };

export default function RepartitionsPage() {
  return (
    <div className="mt-[72px] min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-950 flex flex-col gap-8 px-4 sm:px-6 lg:px-10 py-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Répartitions de stock</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Huile moteur, huile vérin, pneus et batteries distribués aux engins de votre site
        </p>
      </div>

      <RepartitionIndex />
    </div>
  );
}
