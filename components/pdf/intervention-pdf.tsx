import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { IIntervention } from '@/service/interventions/types/interventions/intervention.type';

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
  },
  // En-tête
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#065f46',
  },
  headerLeft: { flex: 1 },
  companyName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#065f46',
    marginBottom: 2,
  },
  companySubtitle: {
    fontSize: 9,
    color: '#6b7280',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  docTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  docMeta: {
    fontSize: 9,
    color: '#6b7280',
  },
  // Badge priorité
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  badgeUrgente: { backgroundColor: '#fee2e2', color: '#991b1b' },
  badgeElevee: { backgroundColor: '#fed7aa', color: '#92400e' },
  badgeMoyenne: { backgroundColor: '#fef3c7', color: '#78350f' },
  badgeFaible: { backgroundColor: '#d1fae5', color: '#065f46' },
  badgeEnCours: { backgroundColor: '#dbeafe', color: '#1e40af' },
  badgeTerminee: { backgroundColor: '#d1fae5', color: '#065f46' },
  badgeAnnulee: { backgroundColor: '#f1f5f9', color: '#475569' },
  // Section
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#065f46',
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#d1fae5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 16,
  },
  // Grid 2 colonnes
  grid2: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    padding: 10,
  },
  gridLabel: {
    fontSize: 8,
    color: '#6b7280',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  gridValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  // Text block
  textBlock: {
    backgroundColor: '#f9fafb',
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  textBlockLabel: {
    fontSize: 8,
    color: '#059669',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  textBlockValue: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
  // Montant en évidence
  costRow: {
    backgroundColor: '#065f46',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  costLabel: { fontSize: 10, color: '#a7f3d0', fontFamily: 'Helvetica-Bold' },
  costValue: { fontSize: 16, color: '#ffffff', fontFamily: 'Helvetica-Bold' },
});

const prioriteBadge = (p: string): (typeof styles)[keyof typeof styles] => {
  const map: Record<string, (typeof styles)[keyof typeof styles]> = {
    URGENTE: styles.badgeUrgente,
    ELEVEE: styles.badgeElevee,
    MOYENNE: styles.badgeMoyenne,
    FAIBLE: styles.badgeFaible,
  };
  return map[p] ?? styles.badgeFaible;
};

const statutBadge = (s: string): (typeof styles)[keyof typeof styles] => {
  const map: Record<string, (typeof styles)[keyof typeof styles]> = {
    EN_COURS: styles.badgeEnCours,
    TERMINEE: styles.badgeTerminee,
    ANNULEE: styles.badgeAnnulee,
  };
  return map[s] ?? styles.badgeAnnulee;
};

interface Props {
  intervention: IIntervention;
  technicienNom: string;
  vehiculeNom: string;
}

export function InterventionPDF({ intervention, technicienNom, vehiculeNom }: Props) {
  const date = new Date(intervention.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const now = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>MaintenancePro</Text>
            <Text style={styles.companySubtitle}>Système de gestion de maintenance</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.docTitle}>Fiche d&apos;Intervention</Text>
            <Text style={styles.docMeta}>Émis le {now}</Text>
          </View>
        </View>

        {/* Titre + Badges */}
        <View style={styles.section}>
          <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#111827', marginBottom: 8 }}>
            {intervention.designation || 'Intervention sans titre'}
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, prioriteBadge(intervention.priorite)]}>
              <Text>Priorité : {intervention.priorite}</Text>
            </View>
            <View style={[styles.badge, statutBadge(intervention.statut)]}>
              <Text>{intervention.statut.replace('_', ' ')}</Text>
            </View>
          </View>
        </View>

        {/* Intervenants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intervenants</Text>
          <View style={styles.grid2}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Technicien</Text>
              <Text style={styles.gridValue}>{technicienNom}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Véhicule</Text>
              <Text style={styles.gridValue}>{vehiculeNom}</Text>
            </View>
          </View>
        </View>

        {/* Dates & Temps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dates & Temps de travail</Text>
          <View style={styles.grid2}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Date</Text>
              <Text style={styles.gridValue}>{date}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Temps estimé</Text>
              <Text style={styles.gridValue}>{intervention.temps_estime_heures} h</Text>
            </View>
            {intervention.temps_reel_heures != null && (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Temps réel</Text>
                <Text style={styles.gridValue}>{intervention.temps_reel_heures} h</Text>
              </View>
            )}
          </View>
        </View>

        {/* Coût */}
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>COÛT TOTAL DE L&apos;INTERVENTION</Text>
          <Text style={styles.costValue}>{intervention.cout?.toLocaleString('fr-FR')} FCFA</Text>
        </View>

        {/* Description */}
        {intervention.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.textBlock}>
              <Text style={styles.textBlockValue}>{intervention.description}</Text>
            </View>
          </View>
        )}

        {/* Situation */}
        {intervention.situation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Situation actuelle</Text>
            <View style={[styles.textBlock, { borderLeftColor: '#d97706' }]}>
              <Text style={styles.textBlockValue}>{intervention.situation}</Text>
            </View>
          </View>
        )}

        {/* Pièces */}
        {intervention.pieces_utilisees && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pièces utilisées</Text>
            <View style={styles.textBlock}>
              <Text style={styles.textBlockValue}>{intervention.pieces_utilisees}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>MaintenancePro — Gestion de maintenance</Text>
          <Text style={styles.footerText}>Document généré le {now}</Text>
        </View>
      </Page>
    </Document>
  );
}
