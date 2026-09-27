'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { FileDown } from 'lucide-react';
import { RepartitionPDF } from './repartition-pdf';
import { IRepartition, IRepartitionSummary } from '@/service/repartition/types/repartition.type';

interface Props {
  site: { nom: string; code: string; region?: string | null };
  periodLabel: string;
  summary: IRepartitionSummary;
  repartitions: IRepartition[];
}

export default function RepartitionPDFButton({ site, periodLabel, summary, repartitions }: Props) {
  const filename = `repartitions-${site.code}-${periodLabel.replace(/\s+/g, '-')}.pdf`;

  return (
    <PDFDownloadLink
      document={<RepartitionPDF site={site} periodLabel={periodLabel} summary={summary} repartitions={repartitions} />}
      fileName={filename}
    >
      {({ loading }) => (
        <button
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg transition text-sm font-medium"
          title="Télécharger le résumé en PDF"
        >
          <FileDown className="h-4 w-4" />
          {loading ? 'Chargement…' : 'Exporter PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
}
