'use client';

import React from 'react';
import BilanCard from './bilan-card';
import InterventionCard from './intervention-card';
import TotalCard from './total-card';

const HomeIndex = () => {
    return (
        <div className='mt-[72px] min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex flex-col gap-12 px-4 sm:px-6 lg:px-10 py-12'>
            {/* Section Bilan */}
            <section className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Tableau de bord
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Bilan des interventions et statistiques</p>
                </div>
                <BilanCard />
            </section>

            {/* Section Interventions */}
            <section className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Types d&apos;interventions
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Catégories et statuts</p>
                </div>
                <InterventionCard />
            </section>

            {/* Section Total */}
            <section className="space-y-6 pb-12">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Résumé général
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Données consolidées</p>
                </div>
                <TotalCard />
            </section>
        </div>
    );
}

export default HomeIndex;
