'use client';

import AjouterTechnicien from "./ajouter-technicien";
import TechniciensList from "./techniciens-list";

const TechnicienIndex = () => {
    return (
        <div className='mt-[72px] min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex flex-col gap-8 px-4 sm:px-6 lg:px-10 py-12'>
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                    Gestion des techniciens
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">Gérez votre équipe de techniciens</p>
            </div>
           <AjouterTechnicien/>
           <TechniciensList />
        </div>
    );
}

export default TechnicienIndex;
