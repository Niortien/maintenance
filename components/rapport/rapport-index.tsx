import AjouterRapportDialog from './ajouter-rapport';
import RapportList from './rapport-list';

const RapportIndex = () => {
  return (
    <div className="mt-[72px] min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-orange-950 dark:to-red-950 flex flex-col gap-8 px-4 sm:px-6 lg:px-10 py-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Rapports journaliers</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Situation logistique quotidienne par site
        </p>
      </div>
      <AjouterRapportDialog />
      <RapportList />
    </div>
  );
};

export default RapportIndex;
