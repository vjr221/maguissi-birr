import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { REPORT_CATEGORIES } from '@/constants/categories';
import { theme } from '@/constants/theme';
import { listReports, saveReport } from '@/services/reportStore';
import type { Report, ReportStatus } from '@/types/report';
import { statusLabel } from '@/utils/reportValidation';

type QueueFilter = 'all' | 'open' | 'progress' | 'resolved';
const FILTERS: { id: QueueFilter; label: string }[] = [
  { id: 'all', label: 'Tous' }, { id: 'open', label: 'À traiter' },
  { id: 'progress', label: 'En cours' }, { id: 'resolved', label: 'Résolus' }
];
const ACTIONS: { status: ReportStatus; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { status: 'QUALIFICATION', label: 'À qualifier', icon: 'search-outline' },
  { status: 'ASSIGNED', label: 'Affecter', icon: 'person-add-outline' },
  { status: 'IN_PROGRESS', label: 'Démarrer', icon: 'play-outline' },
  { status: 'NEEDS_INFO', label: 'Infos requises', icon: 'help-circle-outline' },
  { status: 'RESOLVED', label: 'Résoudre', icon: 'checkmark-circle-outline' }
];
const DONE: ReportStatus[] = ['RESOLVED', 'CLOSED', 'REJECTED', 'DUPLICATE'];
const ACTIVE: ReportStatus[] = ['ASSIGNED', 'IN_PROGRESS'];
function isPriority(report: Report): boolean {
  const category = REPORT_CATEGORIES.find((item) => item.id === report.categoryId);
  const text = `${category?.label ?? ''} ${report.description}`.toLocaleLowerCase('fr');
  return ['incident', 'accident', 'danger immédiat', 'fuite', 'incendie', 'blessé', 'blessure', 'électrocution', 'effondrement', 'risque industriel'].some((term) => text.includes(term));
}
function Metric({ value, label, tone = 'green' }: { value: number; label: string; tone?: 'green' | 'amber' | 'red' }) {
  return <View style={styles.metric}><Text style={[styles.metricValue, tone === 'red' && { color: theme.colors.danger }, tone === 'amber' && { color: '#946713' }]}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}
export default function OperationsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<QueueFilter>('open');
  const [query, setQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    try { setReports(await listReports()); }
    catch { Alert.alert('Chargement impossible', 'Les signalements locaux n’ont pas pu être lus.'); }
    finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { let active = true; listReports().then((items) => { if (active) setReports(items); }).catch(() => { if (active) setReports([]); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []));
  const counts = useMemo(() => ({
    total: reports.length,
    open: reports.filter((r) => !DONE.includes(r.status) && !ACTIVE.includes(r.status)).length,
    progress: reports.filter((r) => ACTIVE.includes(r.status)).length,
    priority: reports.filter(isPriority).filter((r) => !DONE.includes(r.status)).length,
    resolved: reports.filter((r) => ['RESOLVED', 'CLOSED'].includes(r.status)).length
  }), [reports]);
  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('fr');
    return reports.filter((r) => {
      const statusMatch = filter === 'all' || (filter === 'open' && !DONE.includes(r.status) && !ACTIVE.includes(r.status)) || (filter === 'progress' && ACTIVE.includes(r.status)) || (filter === 'resolved' && ['RESOLVED', 'CLOSED'].includes(r.status));
      const category = REPORT_CATEGORIES.find((item) => item.id === r.categoryId)?.label ?? '';
      const searchMatch = !q || [r.reference, r.description, r.region, r.locality ?? '', category].some((value) => value.toLocaleLowerCase('fr').includes(q));
      return statusMatch && searchMatch;
    }).sort((a, b) => Number(isPriority(b)) - Number(isPriority(a)) || Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }, [reports, filter, query]);
  const changeStatus = async (report: Report, status: ReportStatus) => {
    if (savingId) return;
    setSavingId(report.id);
    const at = new Date().toISOString();
    const updated: Report = { ...report, status, events: [...report.events, { status, at, note: `Statut modifié localement : ${statusLabel(status)}` }] };
    try {
      await saveReport(updated);
      setReports((current) => current.map((item) => item.id === report.id ? updated : item));
    } catch {
      Alert.alert('Modification non enregistrée', 'Le changement de statut n’a pas pu être sauvegardé sur cet appareil.');
    } finally { setSavingId(null); }
  };
  return <ScrollView contentContainerStyle={styles.page}>
    <View style={styles.hero}>
      <View style={styles.heroTop}><View style={styles.heroIcon}><Ionicons name="clipboard-outline" size={24} color={theme.colors.forest} /></View><View style={{ flex: 1 }}><Text style={styles.eyebrow}>MAGUISSI BIRR · QHSE</Text><Text style={styles.heroTitle}>Centre d’opérations</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Actualiser" onPress={refresh} style={styles.refresh}><Ionicons name="refresh-outline" size={20} color={theme.colors.white} /></Pressable></View>
      <Text style={styles.heroBody}>Une vue de travail pour trier les signalements, repérer les situations prioritaires et tracer les actions réalisées.</Text>
      <View style={styles.metrics}><Metric value={counts.total} label="Total" /><Metric value={counts.open} label="À traiter" tone="amber" /><Metric value={counts.progress} label="En cours" /><Metric value={counts.priority} label="Prioritaires" tone="red" /></View>
    </View>
    <View style={styles.localNotice}><Ionicons name="phone-portrait-outline" size={18} color="#715314" /><Text style={styles.localNoticeText}>Mode local : les dossiers et changements de statut restent sur cet appareil. Aucune équipe distante n’est notifiée et aucune affectation réelle n’est envoyée.</Text></View>
    <Text style={styles.sectionTitle}>File de traitement</Text>
    <TextInput value={query} onChangeText={setQuery} placeholder="Référence, région, catégorie…" placeholderTextColor={theme.colors.muted} style={styles.search} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{FILTERS.map((item) => <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: filter === item.id }} onPress={() => setFilter(item.id)} style={[styles.filter, filter === item.id && styles.filterActive]}><Text style={[styles.filterText, filter === item.id && styles.filterTextActive]}>{item.label}</Text></Pressable>)}</ScrollView>
    {loading ? <Text style={styles.empty}>Chargement des dossiers…</Text> : visible.length === 0 ? <View style={styles.emptyCard}><Ionicons name="file-tray-outline" size={32} color={theme.colors.muted} /><Text style={styles.emptyTitle}>Aucun dossier dans cette vue</Text><Text style={styles.emptyText}>Créez un signalement ou changez le filtre pour afficher les autres dossiers.</Text></View> : visible.map((report) => {
      const category = REPORT_CATEGORIES.find((item) => item.id === report.categoryId)?.label ?? 'Autre situation';
      const priority = isPriority(report);
      const busy = savingId === report.id;
      return <View key={report.id} style={styles.reportCard}>
        <View style={styles.reportTop}><Text style={styles.reference}>{report.reference}</Text>{priority && <View style={styles.priorityBadge}><Ionicons name="alert-circle" size={13} color={theme.colors.danger} /><Text style={styles.priorityText}>Priorité à vérifier</Text></View>}</View>
        <Text style={styles.category}>{category}</Text><Text style={styles.description}>{report.description}</Text>
        <View style={styles.metaRow}><Ionicons name="location-outline" size={14} color={theme.colors.muted} /><Text style={styles.meta}>{report.region}{report.locality ? ` · ${report.locality}` : ''}</Text></View>
        <View style={styles.reportFoot}><Text style={styles.status}>{statusLabel(report.status)}</Text><Text style={styles.date}>{new Date(report.createdAt).toLocaleDateString('fr-FR')}</Text></View>
        <Text style={styles.actionsLabel}>Tracer une action</Text>
        <View style={styles.actions}>{ACTIONS.filter((a) => a.status !== report.status && !DONE.includes(report.status)).map((action) => <Pressable key={action.status} accessibilityRole="button" disabled={busy} onPress={() => changeStatus(report, action.status)} style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed, busy && { opacity: 0.5 }]}><Ionicons name={action.icon} size={15} color={theme.colors.forest} /><Text style={styles.actionText}>{action.label}</Text></Pressable>)}</View>
        <Text style={styles.history}>{report.events.length} événement(s) dans l’historique local</Text>
      </View>;
    })}
    <View style={styles.footerCard}><Ionicons name="lock-closed-outline" size={19} color={theme.colors.forest} /><Text style={styles.footerText}>Prochaine étape : API sécurisée, comptes et rôles QHSE, affectation nominative, notifications, pièces jointes protégées et journal d’audit centralisé.</Text></View>
  </ScrollView>;
}
const styles = StyleSheet.create({
  page: { padding: 17, paddingBottom: 38, gap: 14 },
  hero: { backgroundColor: theme.colors.forest, borderRadius: 25, padding: 19, gap: 13 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  heroIcon: { width: 47, height: 47, borderRadius: 15, backgroundColor: theme.colors.white, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: '#BDE7CD', fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
  heroTitle: { color: theme.colors.white, fontSize: 23, fontWeight: '900', marginTop: 3 },
  heroBody: { color: '#E0F2E7', fontSize: 12, lineHeight: 18 },
  refresh: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#6AA58A' },
  metrics: { flexDirection: 'row', gap: 7 },
  metric: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 13, paddingVertical: 10, paddingHorizontal: 7, alignItems: 'center', gap: 2 },
  metricValue: { color: theme.colors.forest, fontSize: 21, fontWeight: '900' },
  metricLabel: { color: theme.colors.muted, fontSize: 9, fontWeight: '800', textAlign: 'center' },
  localNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FFF6DF', padding: 12, borderRadius: 13 },
  localNoticeText: { flex: 1, color: '#715F36', fontSize: 11, lineHeight: 16 },
  sectionTitle: { color: theme.colors.ink, fontSize: 19, fontWeight: '900', marginTop: 2 },
  search: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 13, padding: 13, color: theme.colors.ink, fontSize: 13 },
  filters: { gap: 7, paddingVertical: 1 },
  filter: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: theme.colors.white },
  filterActive: { backgroundColor: theme.colors.forest, borderColor: theme.colors.forest },
  filterText: { color: theme.colors.ink, fontSize: 12, fontWeight: '700' },
  filterTextActive: { color: theme.colors.white },
  empty: { color: theme.colors.muted, textAlign: 'center', padding: 20 },
  emptyCard: { backgroundColor: theme.colors.white, borderRadius: 17, padding: 24, alignItems: 'center', gap: 9, borderWidth: 1, borderColor: theme.colors.border },
  emptyTitle: { color: theme.colors.ink, fontSize: 15, fontWeight: '900' },
  emptyText: { color: theme.colors.muted, fontSize: 12, textAlign: 'center', lineHeight: 18 },
  reportCard: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 17, padding: 15, gap: 8 },
  reportTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 7 },
  reference: { color: theme.colors.forest, fontWeight: '900', fontSize: 13 },
  priorityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FDECEA', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  priorityText: { color: theme.colors.danger, fontSize: 10, fontWeight: '900' },
  category: { color: theme.colors.forest, fontWeight: '800', fontSize: 12 },
  description: { color: theme.colors.ink, fontSize: 13, lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { color: theme.colors.muted, fontSize: 11, flex: 1 },
  reportFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 },
  status: { color: theme.colors.forest, backgroundColor: theme.colors.mint, borderRadius: 8, overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 5, fontSize: 10, fontWeight: '900', flexShrink: 1 },
  date: { color: theme.colors.muted, fontSize: 11 },
  actionsLabel: { color: theme.colors.ink, fontSize: 11, fontWeight: '900', marginTop: 5 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.paper, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  actionPressed: { opacity: 0.7 },
  actionText: { color: theme.colors.forest, fontSize: 10, fontWeight: '800' },
  history: { color: theme.colors.muted, fontSize: 10, marginTop: 2 },
  footerCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 14, backgroundColor: theme.colors.mint, borderRadius: 14 },
  footerText: { flex: 1, color: theme.colors.forest, fontSize: 11, lineHeight: 17 }
});
