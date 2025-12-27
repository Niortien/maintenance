'use client';

import AjouterInterventionDialog from "./ajouter-intervention";
import InterventionList from "./interventions-list";

const InterventionIndex = () => {
  return (
    <div className="mt-[72px] min-h-screen  from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex flex-col gap-8 px-4 sm:px-6 lg:px-10 py-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Gestion des interventions
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Planifiez et suivez vos interventions de maintenance</p>
      </div>
      
      {/* Dialog pour ajouter une intervention */}
      <AjouterInterventionDialog />

      {/* Liste des interventions */}
      <InterventionList />
    </div>
  );
};

export default InterventionIndex;
