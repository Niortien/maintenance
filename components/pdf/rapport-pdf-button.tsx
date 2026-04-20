'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { RapportPDF } from './rapport-pdf';
import { IRapport } from '@/service/rapport/types/rapport.type';
import { FileDown } from 'lucide-react';

interface Props {
  rapport: IRapport;
}

export default function RapportPDFButton({ rapport }: Props) {
  const dateStr = new Date(rapport.date).toISOString().slice(0, 10);
  const filename = `rapport-${rapport.site.code}-${dateStr}.pdf`;

  return (
    <PDFDownloadLink
      document={<RapportPDF rapport={rapport} />}
      fileName={filename}
    >
      {({ loading }) => (
        <button
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition text-sm font-medium"
          title="Télécharger le rapport en PDF"
        >
          <FileDown className="h-4 w-4" />
          {loading ? 'Chargement…' : 'Exporter PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
}
