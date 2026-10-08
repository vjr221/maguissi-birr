import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { listReports } from '@/services/reportStore';
import type { Report } from '@/types/report';
import { theme } from '@/constants/theme';
import { statusLabel } from '@/utils/reportValidation';
import { REPORT_CATEGORIES } from '@/constants/categories';

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  useFocusEffect(useCallback(() => { let active = true; listReports().then((items) => { if (active) setReports(items); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []));
  const normalizedQuery = query.trim().toLocaleLowerCase('fr');
  const filteredReports = reports.filter((report) => [report.reference, report.description, report.region, report.locality ?? '', REPORT_CATEGORIES.find((category) => category.id === report.categoryId)?.label ?? ''].some((value) => value.toLocaleLowerCase('fr').includes(normalizedQuery)));
  return <ScrollView contentContainerStyle={styles.page}>
    <Text style={styles.intro}>Les signalements ci-dessous sont enregistrés sur cet appareil. Le suivi à distance sera disponible après mise en place de l'API sécurisée.</Text>
    {!loading && reports.length > 0 && <TextInput value={query} onChangeText={setQuery} placeholder="Rechercher par référence, région ou texte…" placeholderTextColor={theme.colors.muted} style={styles.search} />}
    {loading ? <Text style={styles.empty}>Chargement…</Text> : reports.length === 0 ? <View style={styles.emptyCard}><Text style={styles.emptyIcon}>🗂️</Text><Text style={styles.emptyTitle}>Aucun signalement enregistré</Text><Text style={styles.empty}>Vos signalements apparaîtront ici après leur enregistrement.</Text></View> : filteredReports.length === 0 ? <Text style={styles.empty}>Aucun résultat pour cette recherche.</Text> : filteredReports.map((report) => <View key={report.id} style={styles.card}><Text style={styles.ref}>{report.reference}</Text><Text style={styles.category}>{REPORT_CATEGORIES.find((category) => category.id === report.categoryId)?.label ?? 'Autre situation'}</Text><Text style={styles.description}>{report.description}</Text><Text style={styles.meta}>{report.region}{report.locality ? ' · ' + report.locality : ''}</Text><Text style={styles.status}>{statusLabel(report.status)}</Text><Text style={styles.meta}>{new Date(report.createdAt).toLocaleString('fr-FR')}</Text></View>)}
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { padding: 18, gap: 12 }, search: { backgroundColor: theme.colors.white, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: theme.colors.ink, fontSize: 14 }, category: { color: theme.colors.forest, fontSize: 12, fontWeight: '800' }, status: { alignSelf: 'flex-start', backgroundColor: theme.colors.mint, color: theme.colors.forest, borderRadius: 8, overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 5, fontSize: 11, fontWeight: '800' }, intro: { color: theme.colors.muted, lineHeight: 21 }, emptyCard: { marginTop: 30, padding: 24, alignItems: 'center', gap: 8, backgroundColor: theme.colors.white, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border }, emptyIcon: { fontSize: 36 }, emptyTitle: { color: theme.colors.ink, fontWeight: '800', fontSize: 16 }, empty: { color: theme.colors.muted, textAlign: 'center', lineHeight: 20 }, card: { backgroundColor: theme.colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border, gap: 7 }, ref: { color: theme.colors.forest, fontWeight: '900' }, description: { color: theme.colors.ink, fontWeight: '600' }, meta: { color: theme.colors.muted, fontSize: 12 } });
