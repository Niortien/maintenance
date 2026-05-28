'use client';

import {
  Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image,
} from '@react-pdf/renderer';
import { IAdminRapport } from '@/service/auth/types/auth.type';

const STATUT_LABELS: Record<string, string> = {
  OPERATIONNEL: 'Opérationnel',
  EN_PANNE: 'En panne',
  ACCIDENTE: 'Accidenté',
  EN_ATTENTE: 'En attente',
};

const CATEGORIE_LABELS: Record<string, string> = {
  TASSEUR: 'Tasseur', BP: 'BP', AMPLIROLL: 'Ampliroll', TRACTEUR: 'Tracteur',
  KIA: 'KIA', VOITURETTE: 'Voiturette', PC: 'PC', MOTO_TRICYCLE: 'Moto-Tricycle', KB: 'KB',
};

const styles = StyleSheet.create({
  page: { padding: 32, fontFamily: 'Helvetica', fontSize: 9, color: '#1f2937' },
  title: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 3 },
  subtitle: { fontSize: 8, color: '#6b7280', marginBottom: 14 },
  statRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statBox: { flex: 1, padding: '7 10', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 3, alignItems: 'center' },
  statNum: { fontSize: 16, fontWeight: 'bold' },
  statLabel: { fontSize: 7, color: '#6b7280', marginTop: 2 },
  // Détail par statut
  statusGrid: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statusCol: { flex: 1, borderRadius: 4, padding: 7 },
  statusColGreen: { backgroundColor: '#f0fdf4', borderLeftWidth: 2, borderLeftColor: '#10b981' },
  statusColRed: { backgroundColor: '#fef2f2', borderLeftWidth: 2, borderLeftColor: '#ef4444' },
  statusColPurple: { backgroundColor: '#f5f3ff', borderLeftWidth: 2, borderLeftColor: '#8b5cf6' },
  statusColAmber: { backgroundColor: '#fffbeb', borderLeftWidth: 2, borderLeftColor: '#f59e0b' },
  statusColTitle: { fontSize: 7.5, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  statusItem: { fontSize: 7, marginBottom: 2, color: '#374151' },
  statusNote: { fontSize: 6.5, color: '#6b7280', marginLeft: 8, marginBottom: 2 },
  statusEmpty: { fontSize: 7, color: '#9ca3af' },
  //
  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', marginBottom: 5, color: '#374151', textTransform: 'uppercase' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  tableRow: { flexDirection: 'row', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#e5e7eb' },
  cellCode: { padding: '4 6', width: 85, borderRightWidth: 1, borderRightColor: '#e5e7eb' },
  cellStatut: { padding: '4 6', width: 82, borderRightWidth: 1, borderRightColor: '#e5e7eb' },
  cellDesc: { padding: '4 6', flex: 1 },
  headerCell: { fontSize: 8, fontWeight: 'bold', color: '#6b7280' },
  footer: { marginTop: 18, fontSize: 7, color: '#9ca3af', textAlign: 'center' },
});

function RapportPDFDoc({ rapport }: { rapport: IAdminRapport }) {
  const ops = rapport.lignes.filter((l) => l.statut === 'OPERATIONNEL').length;
  const pannes = rapport.lignes.filter((l) => l.statut === 'EN_PANNE').length;
  const accidents = rapport.lignes.filter((l) => l.statut === 'ACCIDENTE').length;
  const attente = rapport.lignes.filter((l) => l.statut === 'EN_ATTENTE').length;

  const lignesOp = rapport.lignes.filter((l) => l.statut === 'OPERATIONNEL');
  const lignesPanne = rapport.lignes.filter((l) => l.statut === 'EN_PANNE');
  const lignesAcc = rapport.lignes.filter((l) => l.statut === 'ACCIDENTE');
  const lignesAtt = rapport.lignes.filter((l) => l.statut === 'EN_ATTENTE');

  const categories = [...new Set(rapport.lignes.map((l) => l.categorie))];
  const dateStr = new Date(rapport.date).toLocaleDateString('fr-FR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 3 }}>
          <Image src="/assets/images/logogi2e.jpg" style={{ width: 40, height: 40, borderRadius: 4 }} />
          <View>
            <Text style={styles.title}>Rapport journalier — {rapport.site.nom}</Text>
            <Text style={styles.subtitle}>
              {dateStr} · {rapport.site.region ?? ''} · Généré le {new Date().toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{rapport.lignes.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#10b981' }]}>
            <Text style={[styles.statNum, { color: '#10b981' }]}>{ops}</Text>
            <Text style={styles.statLabel}>Opérationnels</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#f59e0b' }]}>
            <Text style={[styles.statNum, { color: '#f59e0b' }]}>{pannes}</Text>
            <Text style={styles.statLabel}>En panne</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#ef4444' }]}>
            <Text style={[styles.statNum, { color: '#ef4444' }]}>{accidents}</Text>
            <Text style={styles.statLabel}>Accidentés</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#6b7280' }]}>
            <Text style={[styles.statNum, { color: '#6b7280' }]}>{attente}</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
        </View>

        {/* Détail par statut */}
        <Text style={[styles.sectionTitle, { marginBottom: 6 }]}>Récapitulatif par statut</Text>
        <View style={styles.statusGrid}>

          {/* Opérationnels */}
          <View style={[styles.statusCol, styles.statusColGreen]}>
            <Text style={[styles.statusColTitle, { color: '#065f46' }]}>Opérationnels ({ops})</Text>
            {lignesOp.length === 0
              ? <Text style={styles.statusEmpty}>Aucun véhicule</Text>
              : lignesOp.map((l) => (
                <Text key={l.id} style={styles.statusItem}>
                  • {l.codeVehicule}{l.immatriculation ? ` / ${l.immatriculation}` : ''}
                </Text>
              ))
            }
          </View>

          {/* En panne */}
          <View style={[styles.statusCol, styles.statusColRed]}>
            <Text style={[styles.statusColTitle, { color: '#991b1b' }]}>En panne ({pannes})</Text>
            {lignesPanne.length === 0
              ? <Text style={styles.statusEmpty}>Aucun véhicule</Text>
              : lignesPanne.map((l) => (
                <View key={l.id} style={{ marginBottom: 3 }}>
                  <Text style={styles.statusItem}>• {l.codeVehicule}{l.immatriculation ? ` / ${l.immatriculation}` : ''}</Text>
                  {(l.typesPannes?.length > 0 || l.description) && (
                    <Text style={styles.statusNote}>
                      {l.typesPannes?.length > 0 ? l.typesPannes.join(', ') : ''}{l.description ? ` — ${l.description}` : ''}
                    </Text>
                  )}
                </View>
              ))
            }
          </View>

          {/* Accidentés */}
          <View style={[styles.statusCol, styles.statusColPurple]}>
            <Text style={[styles.statusColTitle, { color: '#5b21b6' }]}>Accidentés ({accidents})</Text>
            {lignesAcc.length === 0
              ? <Text style={styles.statusEmpty}>Aucun véhicule</Text>
              : lignesAcc.map((l) => (
                <View key={l.id} style={{ marginBottom: 3 }}>
                  <Text style={styles.statusItem}>• {l.codeVehicule}{l.immatriculation ? ` / ${l.immatriculation}` : ''}</Text>
                  {l.description && (
                    <Text style={styles.statusNote}>{l.description}</Text>
                  )}
                </View>
              ))
            }
          </View>

          {/* En attente */}
          <View style={[styles.statusCol, styles.statusColAmber]}>
            <Text style={[styles.statusColTitle, { color: '#78350f' }]}>En attente ({attente})</Text>
            {lignesAtt.length === 0
              ? <Text style={styles.statusEmpty}>Aucun véhicule</Text>
              : lignesAtt.map((l) => (
                <View key={l.id} style={{ marginBottom: 3 }}>
                  <Text style={styles.statusItem}>• {l.codeVehicule}{l.immatriculation ? ` / ${l.immatriculation}` : ''}</Text>
                  {(l.typesPannes?.length > 0 || l.description) && (
                    <Text style={styles.statusNote}>
                      {l.typesPannes?.length > 0 ? l.typesPannes.join(', ') : ''}{l.description ? ` — ${l.description}` : ''}
                    </Text>
                  )}
                </View>
              ))
            }
          </View>

        </View>

        {categories.map((cat) => {
          const lignes = rapport.lignes.filter((l) => l.categorie === cat);
          return (
            <View key={cat} style={styles.section}>
              <Text style={styles.sectionTitle}>{CATEGORIE_LABELS[cat] ?? cat} ({lignes.length})</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.cellCode, styles.headerCell]}>Code / Immat.</Text>
                <Text style={[styles.cellStatut, styles.headerCell]}>Statut</Text>
                <Text style={[styles.cellDesc, styles.headerCell]}>Observations / Pannes</Text>
              </View>
              {lignes.map((l) => (
                <View key={l.id} style={styles.tableRow}>
                  <Text style={styles.cellCode}>
                    {l.codeVehicule}{l.immatriculation ? ` / ${l.immatriculation}` : ''}
                  </Text>
                  <Text style={styles.cellStatut}>{STATUT_LABELS[l.statut] ?? l.statut}</Text>
                  <Text style={styles.cellDesc}>
                    {l.description ?? (l.typesPannes?.length ? l.typesPannes.join(', ') : '—')}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}

        <Text style={styles.footer}>GI2E Maintenance — Rapport généré automatiquement</Text>
      </Page>
    </Document>
  );
}

export default function RapportPDFButton({ rapport }: { rapport: IAdminRapport }) {
  const dateStr = new Date(rapport.date).toISOString().split('T')[0];
  const filename = `rapport-${rapport.site.code}-${dateStr}.pdf`;

  return (
    <PDFDownloadLink document={<RapportPDFDoc rapport={rapport} />} fileName={filename}>
      {({ loading }) => (
        <button
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-600 transition disabled:opacity-60"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {loading ? 'Génération...' : 'Exporter PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
}
