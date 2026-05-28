import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { IRapport, ILigneRapport } from '@/service/rapport/types/rapport.type';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
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
  // Info site
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
  // Stats résumé
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  statCardGreen: { backgroundColor: '#d1fae5' },
  statCardRed: { backgroundColor: '#fee2e2' },
  statCardAmber: { backgroundColor: '#fef3c7' },
  statCardSlate: { backgroundColor: '#f1f5f9' },
  statValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  statValueGreen: { color: '#065f46' },
  statValueRed: { color: '#991b1b' },
  statValueAmber: { color: '#78350f' },
  statLabel: { fontSize: 7, color: '#6b7280', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' },
  // Tableau
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#065f46',
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#d1fae5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  table: { width: '100%', marginBottom: 20 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#065f46',
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableHeaderCell: { color: '#ffffff', fontFamily: 'Helvetica-Bold', fontSize: 8 },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0fdf4',
  },
  tableRowAlt: { backgroundColor: '#f9fafb' },
  tableCell: { fontSize: 8, color: '#374151' },
  // Colonnes
  col1: { flex: 0.7 },
  col2: { flex: 1 },
  col3: { flex: 1 },
  col4: { flex: 1 },
  col5: { flex: 2 },
  // Badge statut
  badgeOp: { backgroundColor: '#d1fae5', color: '#065f46', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 10, fontSize: 7, fontFamily: 'Helvetica-Bold' },
  badgePanne: { backgroundColor: '#fee2e2', color: '#991b1b', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 10, fontSize: 7, fontFamily: 'Helvetica-Bold' },
  badgeAtt: { backgroundColor: '#fef3c7', color: '#78350f', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 10, fontSize: 7, fontFamily: 'Helvetica-Bold' },
  badgeAcc: { backgroundColor: '#ede9fe', color: '#5b21b6', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 10, fontSize: 7, fontFamily: 'Helvetica-Bold' },
  // Détail par statut
  statusGrid: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  statusCol: { flex: 1, borderRadius: 6, padding: 8 },
  statusColGreen: { backgroundColor: '#f0fdf4', borderLeftWidth: 2, borderLeftColor: '#10b981' },
  statusColRed: { backgroundColor: '#fef2f2', borderLeftWidth: 2, borderLeftColor: '#ef4444' },
  statusColPurple: { backgroundColor: '#f5f3ff', borderLeftWidth: 2, borderLeftColor: '#8b5cf6' },
  statusColAmber: { backgroundColor: '#fffbeb', borderLeftWidth: 2, borderLeftColor: '#f59e0b' },
  statusColTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 5 },
  statusItem: { fontSize: 7, marginBottom: 2, color: '#374151' },
  statusNote: { fontSize: 6.5, color: '#6b7280', marginLeft: 8, marginBottom: 2 },
  statusEmpty: { fontSize: 7, color: '#9ca3af', fontStyle: 'italic' },
  // Footer
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

const statutStyle = (s: string): (typeof styles)[keyof typeof styles] => {
  switch (s) {
    case 'OPERATIONNEL': return styles.badgeOp;
    case 'EN_PANNE': return styles.badgePanne;
    case 'EN_ATTENTE': return styles.badgeAtt;
    case 'ACCIDENTE': return styles.badgeAcc;
    default: return styles.badgeAtt;
  }
};

interface Props {
  rapport: IRapport;
}

export function RapportPDF({ rapport }: Props) {
  const date = new Date(rapport.date).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const now = new Date().toLocaleDateString('fr-FR');

  const total = rapport.lignes.length;
  const ops = rapport.lignes.filter(l => l.statut === 'OPERATIONNEL').length;
  const pannes = rapport.lignes.filter(l => l.statut === 'EN_PANNE').length;
  const accidents = rapport.lignes.filter(l => l.statut === 'ACCIDENTE').length;
  const attente = rapport.lignes.filter(l => l.statut === 'EN_ATTENTE').length;

  const lignesOp = rapport.lignes.filter(l => l.statut === 'OPERATIONNEL');
  const lignesPanne = rapport.lignes.filter(l => l.statut === 'EN_PANNE');
  const lignesAcc = rapport.lignes.filter(l => l.statut === 'ACCIDENTE');
  const lignesAtt = rapport.lignes.filter(l => l.statut === 'EN_ATTENTE');

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image src="/assets/images/logogi2e.jpg" style={{ width: 44, height: 44, borderRadius: 6 }} />
            <View>
              <Text style={styles.companyName}>GI2E Maintenance</Text>
              <Text style={styles.companySubtitle}>Groupement Ivoire Eco Environnement</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.docTitle}>Rapport Journalier</Text>
            <Text style={styles.docMeta}>Généré le {now}</Text>
          </View>
        </View>

        {/* Info Site */}
        <View style={styles.siteBox}>
          <View>
            <Text style={styles.siteLabel}>Site</Text>
            <Text style={styles.siteValue}>{rapport.site.nom} ({rapport.site.code})</Text>
          </View>
          <View>
            <Text style={styles.siteLabel}>Date du rapport</Text>
            <Text style={styles.siteValue}>{date}</Text>
          </View>
          {rapport.site.region && (
            <View>
              <Text style={styles.siteLabel}>Région</Text>
              <Text style={styles.siteValue}>{rapport.site.region}</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardSlate]}>
            <Text style={[styles.statValue, { color: '#374151' }]}>{total}</Text>
            <Text style={styles.statLabel}>Total véhicules</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={[styles.statValue, styles.statValueGreen]}>{ops}</Text>
            <Text style={styles.statLabel}>Opérationnels</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={[styles.statValue, styles.statValueRed]}>{pannes}</Text>
            <Text style={styles.statLabel}>En panne</Text>
          </View>
          <View style={[styles.statCard, styles.statCardAmber]}>
            <Text style={[styles.statValue, styles.statValueAmber]}>{accidents}</Text>
            <Text style={styles.statLabel}>Accidentés</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
            <Text style={[styles.statValue, { color: '#059669' }]}>{total > 0 ? Math.round((ops / total) * 100) : 0}%</Text>
            <Text style={styles.statLabel}>Taux dispo.</Text>
          </View>
        </View>

        {/* Détail par statut */}
        <Text style={styles.sectionTitle}>Récapitulatif par statut</Text>
        <View style={styles.statusGrid}>

          {/* Opérationnels */}
          <View style={[styles.statusCol, styles.statusColGreen]}>
            <Text style={[styles.statusColTitle, { color: '#065f46' }]}>Opérationnels ({ops})</Text>
            {lignesOp.length === 0
              ? <Text style={styles.statusEmpty}>Aucun véhicule</Text>
              : lignesOp.map(l => (
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
              : lignesPanne.map(l => (
                <View key={l.id} style={{ marginBottom: 3 }}>
                  <Text style={styles.statusItem}>• {l.codeVehicule}{l.immatriculation ? ` / ${l.immatriculation}` : ''}</Text>
                  {(l.typesPannes.length > 0 || l.description) && (
                    <Text style={styles.statusNote}>
                      {l.typesPannes.length > 0 ? l.typesPannes.join(', ') : ''}{l.description ? ` — ${l.description}` : ''}
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
              : lignesAcc.map(l => (
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
              : lignesAtt.map(l => (
                <View key={l.id} style={{ marginBottom: 3 }}>
                  <Text style={styles.statusItem}>• {l.codeVehicule}{l.immatriculation ? ` / ${l.immatriculation}` : ''}</Text>
                  {(l.typesPannes.length > 0 || l.description) && (
                    <Text style={styles.statusNote}>
                      {l.typesPannes.length > 0 ? l.typesPannes.join(', ') : ''}{l.description ? ` — ${l.description}` : ''}
                    </Text>
                  )}
                </View>
              ))
            }
          </View>

        </View>

        {/* Tableau des lignes */}
        <Text style={styles.sectionTitle}>Détail du parc — {total} véhicule(s)</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>Code</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Immat.</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Catégorie</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Statut</Text>
            <Text style={[styles.tableHeaderCell, styles.col5]}>Types de pannes / Observations</Text>
          </View>
          {rapport.lignes.map((ligne: ILigneRapport, i: number) => (
            <View key={ligne.id} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCell, styles.col1]}>{ligne.codeVehicule}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{ligne.immatriculation ?? '—'}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{ligne.categorie}</Text>
              <View style={[styles.col4]}>
                <Text style={statutStyle(ligne.statut)}>{ligne.statut}</Text>
              </View>
              <Text style={[styles.tableCell, styles.col5]}>
                {ligne.typesPannes.length > 0 ? ligne.typesPannes.join(', ') : ''}
                {ligne.description ? ` — ${ligne.description}` : ''}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>GI2E Maintenance — {rapport.site.nom}</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
