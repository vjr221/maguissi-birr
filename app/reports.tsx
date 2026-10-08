import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { listReports } from '@/services/reportStore';
import type { Report } from '@/types/report';
import { theme } from '@/constants/theme';

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  useFocusEffect(useCallback(() => { let active = true; listReports().then((items) => { if (active) setReports(items); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []));
  return <ScrollView contentContainerStyle={styles.page}>
    <Text style={styles.intro}>Les signalements ci-dessous sont enregistrés sur cet appareil. Le suivi à distance sera disponible après mise en place de l'API sécurisée.</Text>
    {loading ? <Text style={styles.empty}>Chargement…</Text> : reports.length === 0 ? <View style={styles.emptyCard}><Text style={styles.emptyIcon}>🗂️</Text><Text style={styles.emptyTitle}>Aucun signalement enregistré</Text><Text style={styles.empty}>Vos signalements apparaîtront ici après leur enregistrement.</Text></View> : reports.map((report) => <View key={report.id} style={styles.card}><Text style={styles.ref}>{report.reference}</Text><Text style={styles.description}>{report.description}</Text><Text style={styles.meta}>{report.region} · {report.status.replaceAll('_', ' ')}</Text></View>)}
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { padding: 18, gap: 12 }, intro: { color: theme.colors.muted, lineHeight: 21 }, emptyCard: { marginTop: 30, padding: 24, alignItems: 'center', gap: 8, backgroundColor: theme.colors.white, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border }, emptyIcon: { fontSize: 36 }, emptyTitle: { color: theme.colors.ink, fontWeight: '800', fontSize: 16 }, empty: { color: theme.colors.muted, textAlign: 'center', lineHeight: 20 }, card: { backgroundColor: theme.colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border, gap: 7 }, ref: { color: theme.colors.forest, fontWeight: '900' }, description: { color: theme.colors.ink, fontWeight: '600' }, meta: { color: theme.colors.muted, fontSize: 12 } });
