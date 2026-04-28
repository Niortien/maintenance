import { redirect } from 'next/navigation';
import { getProfile } from '@/service/auth/auth.action';

export default async function ResponsableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getProfile();

  if (!result.success) {
    redirect('/api/auth/clear');
  }

  const { responsable } = { responsable: result.data };
  const couleur = responsable.site.couleur ?? '#10b981';

  return (
    <div
      className="min-h-screen"
      style={{ '--site-color': couleur } as React.CSSProperties}
    >
      {/* Barre de contexte site */}
      <div
        className="flex items-center justify-between px-6 py-2 text-sm font-medium text-white"
        style={{ backgroundColor: couleur }}
      >
        <span>
          Site : <strong>{responsable.site.nom}</strong>
          {responsable.site.region ? ` — ${responsable.site.region}` : ''}
        </span>
        <span className="opacity-80">
          {responsable.prenom} {responsable.nom}
        </span>
      </div>
      {children}
    </div>
  );
}
