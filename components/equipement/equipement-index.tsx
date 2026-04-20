import AjouterEquipementDialog from './ajouter-equipement';
import EquipementList from './equipement-list';

const EquipementIndex = () => {
  return (
    <div className="mt-[72px] min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-teal-950 dark:to-cyan-950 flex flex-col gap-8 px-4 sm:px-6 lg:px-10 py-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Stock des équipements
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Gérez les équipements de votre site
        </p>
      </div>

      <AjouterEquipementDialog />
      <EquipementList />
    </div>
  );
};

export default EquipementIndex;
