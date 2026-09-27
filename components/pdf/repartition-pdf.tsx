import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { IRepartition, IRepartitionSummary, TypeConsommable } from '@/service/repartition/types/repartition.type';
import { TYPE_CONSOMMABLE_LABELS } from '@/service/repartition/repartition.schema';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 36,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 3,
    borderBottomColor: '#065f46',
  },
  companyName: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#065f46' },
  companySubtitle: { fontSize: 8, color: '#6b7280', marginTop: 2 },
  docTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#111827', marginBottom: 3 },
  docMeta: { fontSize: 8, color: '#6b7280' },
  siteBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 20,
  },
  siteLabel: { fontSize: 8, color: '#6b7280', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' },
  siteValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#065f46', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  statCard: { flex: 1, borderRadius: 6, padding: 8, alignItems: 'center' },
  statCardSlate: { backgroundColor: '#f1f5f9' },
  statCardGreen: { backgroundColor: '#d1fae5' },
  statValue: { fontSize: 15, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  statLabel: { fontSize: 7, color: '#6b7280', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#065f46',
    marginBottom: 6,
    marginTop: 12,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#d1fae5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  table: { width: '100%', marginBottom: 6 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#065f46',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableHeaderCell: { color: '#ffffff', fontFamily: 'Helvetica-Bold', fontSize: 7 },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0fdf4',
  },
  tableRowAlt: { backgroundColor: '#f9fafb' },
  tableRowTotal: { backgroundColor: '#d1fae5' },
  tableCell: { fontSize: 7, color: '#374151' },
  tableCellBold: { fontSize: 7, color: '#065f46', fontFamily: 'Helvetica-Bold' },
  colDate: { flex: 0.9 },
  colDesig: { flex: 1.1 },
  colNum: { flex: 0.8, textAlign: 'right' },
  colEngin: { flex: 0.8 },
  colFourn: { flex: 1 },
  emptyText: { fontSize: 7, color: '#9ca3af', fontStyle: 'italic', marginBottom: 10 },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 6,
  },
  footerText: { fontSize: 7, color: '#9ca3af' },
});

const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR');
const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR');

interface Props {
  site: { nom: string; code: string; region?: string | null };
  periodLabel: string;
  summary: IRepartitionSummary;
  repartitions: IRepartition[];
}

const TYPES: TypeConsommable[] = ['HUILE_MOTEUR', 'HUILE_VERIN', 'PNEU', 'BATTERIE'];

export function RepartitionPDF({ site, periodLabel, summary, repartitions }: Props) {
  const now = new Date().toLocaleDateString('fr-FR');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image src="/assets/images/logogi2e.jpg" style={{ width: 40, height: 40, borderRadius: 6 }} />
            <View>
              <Text style={styles.companyName}>GI2E Maintenance</Text>
              <Text style={styles.companySubtitle}>Groupement Ivoire Eco Environnement</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.docTitle}>Répartitions HPB</Text>
            <Text style={styles.docMeta}>Généré le {now}</Text>
          </View>
        </View>

        <View style={styles.siteBox}>
          <View>
            <Text style={styles.siteLabel}>Site</Text>
            <Text style={styles.siteValue}>{site.nom} ({site.code})</Text>
          </View>
          <View>
            <Text style={styles.siteLabel}>Période</Text>
            <Text style={styles.siteValue}>{periodLabel}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardSlate]}>
            <Text style={[styles.statValue, { color: '#374151' }]}>{fmt(summary.global.montantAchatTotal)}</Text>
            <Text style={styles.statLabel}>Total achat (FCFA)</Text>
          </View>
          <View style={[styles.statCard, styles.statCardSlate]}>
            <Text style={[styles.statValue, { color: '#374151' }]}>{fmt(summary.global.montantVenteTotal)}</Text>
            <Text style={styles.statLabel}>Total vente (FCFA)</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={[styles.statValue, { color: '#065f46' }]}>{fmt(summary.global.beneficeTotal)}</Text>
            <Text style={styles.statLabel}>Bénéfice (FCFA)</Text>
          </View>
        </View>

        {TYPES.map((type) => {
          const lignes = repartitions.filter((r) => r.type === type);
          const totaux = summary.parType.find((s) => s.type === type);
          const showDesignation = type === 'PNEU';

          return (
            <View key={type} wrap={false}>
              <Text style={styles.sectionTitle}>{TYPE_CONSOMMABLE_LABELS[type]} — {lignes.length} ligne(s)</Text>

              {lignes.length === 0 ? (
                <Text style={styles.emptyText}>Aucune répartition sur la période</Text>
              ) : (
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, styles.colDate]}>Date</Text>
                    {showDesignation && <Text style={[styles.tableHeaderCell, styles.colDesig]}>Désignation</Text>}
                    <Text style={[styles.tableHeaderCell, styles.colNum]}>Qté</Text>
                    <Text style={[styles.tableHeaderCell, styles.colNum]}>PU achat</Text>
                    <Text style={[styles.tableHeaderCell, styles.colNum]}>Mt achat</Text>
                    <Text style={[styles.tableHeaderCell, styles.colNum]}>PU vente</Text>
                    <Text style={[styles.tableHeaderCell, styles.colNum]}>Mt vente</Text>
                    <Text style={[styles.tableHeaderCell, styles.colNum]}>Bénéfice</Text>
                    <Text style={[styles.tableHeaderCell, styles.colEngin]}>Engin</Text>
                    <Text style={[styles.tableHeaderCell, styles.colFourn]}>Fournisseur</Text>
                  </View>
                  {lignes.map((l, i) => (
                    <View key={l.id} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                      <Text style={[styles.tableCell, styles.colDate]}>{fmtDate(l.date)}</Text>
                      {showDesignation && <Text style={[styles.tableCell, styles.colDesig]}>{l.designation ?? '—'}</Text>}
                      <Text style={[styles.tableCell, styles.colNum]}>{fmt(l.quantite)}</Text>
                      <Text style={[styles.tableCell, styles.colNum]}>{fmt(l.prixUnitaireAchat)}</Text>
                      <Text style={[styles.tableCell, styles.colNum]}>{fmt(l.montantAchat)}</Text>
                      <Text style={[styles.tableCell, styles.colNum]}>{fmt(l.prixUnitaireVente)}</Text>
                      <Text style={[styles.tableCell, styles.colNum]}>{fmt(l.montantVente)}</Text>
                      <Text style={[styles.tableCell, styles.colNum]}>{fmt(l.benefice)}</Text>
                      <Text style={[styles.tableCell, styles.colEngin]}>{l.vehicule?.nom ?? '—'}</Text>
                      <Text style={[styles.tableCell, styles.colFourn]}>{l.fournisseur ?? '—'}</Text>
                    </View>
                  ))}
                  {totaux && (
                    <View style={[styles.tableRow, styles.tableRowTotal]}>
                      <Text style={[styles.tableCellBold, styles.colDate]}>TOTAL</Text>
                      {showDesignation && <Text style={[styles.tableCellBold, styles.colDesig]} />}
                      <Text style={[styles.tableCellBold, styles.colNum]}>{fmt(totaux.quantiteTotale)}</Text>
                      <Text style={[styles.tableCellBold, styles.colNum]} />
                      <Text style={[styles.tableCellBold, styles.colNum]}>{fmt(totaux.montantAchatTotal)}</Text>
                      <Text style={[styles.tableCellBold, styles.colNum]} />
                      <Text style={[styles.tableCellBold, styles.colNum]}>{fmt(totaux.montantVenteTotal)}</Text>
                      <Text style={[styles.tableCellBold, styles.colNum]}>{fmt(totaux.beneficeTotal)}</Text>
                      <Text style={[styles.tableCellBold, styles.colEngin]} />
                      <Text style={[styles.tableCellBold, styles.colFourn]} />
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>GI2E Maintenance — {site.nom}</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
