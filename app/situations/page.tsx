import SituationIndex from '@/components/situation/situation-index';

export const metadata = { title: 'Situations — MaintenancePro' };

export default function SituationsPage() {
  return (
    <div className="mt-[72px] min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-orange-950 dark:to-amber-950 flex flex-col gap-8 px-4 sm:px-6 lg:px-10 py-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Situations
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Rapports de pannes et besoins logistiques de votre site
        </p>
      </div>

      <SituationIndex />
    </div>
  );
}
