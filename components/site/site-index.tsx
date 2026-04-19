import AjouterSiteDialog from './ajouter-site';
import SiteList from './site-list';

const SiteIndex = () => {
  return (
    <div className="mt-[72px] min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-slate-900 dark:via-orange-950 dark:to-amber-950 flex flex-col gap-8 px-4 sm:px-6 lg:px-10 py-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Gestion des sites</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Gérez les sites logistiques de votre organisation</p>
      </div>
      <AjouterSiteDialog />
      <SiteList />
    </div>
  );
};

export default SiteIndex;
