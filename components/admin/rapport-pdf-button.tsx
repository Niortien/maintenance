'use client';

import dynamic from 'next/dynamic';
import { IAdminRapport } from '@/service/auth/types/auth.type';

const RapportPDFInner = dynamic(() => import('./rapport-pdf-inner'), {
  ssr: false,
  loading: () => (
    <button className="flex items-center gap-2 rounded-lg bg-amber-500/60 px-4 py-2 text-sm font-semibold text-white" disabled>
      Chargement PDF...
    </button>
  ),
});

export default function RapportPDFButton({ rapport }: { rapport: IAdminRapport }) {
  return <RapportPDFInner rapport={rapport} />;
}
