'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { InterventionPDF } from './intervention-pdf';
import { IIntervention } from '@/service/interventions/types/interventions/intervention.type';
import { FileDown } from 'lucide-react';

interface Props {
  intervention: IIntervention;
  technicienNom: string;
  vehiculeNom: string;
}

export default function InterventionPDFButton({ intervention, technicienNom, vehiculeNom }: Props) {
  const filename = `intervention-${intervention.designation?.replace(/\s+/g, '-').toLowerCase() ?? intervention.id}-${new Date(intervention.date).toISOString().slice(0, 10)}.pdf`;

  return (
    <PDFDownloadLink
      document={<InterventionPDF intervention={intervention} technicienNom={technicienNom} vehiculeNom={vehiculeNom} />}
      fileName={filename}
    >
      {({ loading }) => (
        <button
          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition text-sm font-medium"
          title="Télécharger en PDF"
        >
          <FileDown className="h-4 w-4" />
          {loading ? '...' : 'PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
}
