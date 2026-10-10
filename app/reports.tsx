import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { listReports } from '@/services/reportStore';
import type { Report } from '@/types/report';
import { theme } from '@/constants/theme';
import { statusLabel } from '@/utils/reportValidation';
import { REPORT_CATEGORIES } from '@/constants/categories';

const SES_EMAIL = 'moctar.diallo@sen-environnement-services.com';

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  useFocusEffect(useCallback(() => {
    let active = true;
    listReports().then((items) => { if (active) setReports(items); })
      .catch((error: unknown) => { if (active) Alert.alert('Données locales à vérifier', error instanceof Error ? error.message : 'Les signalements enregistrés sur cet appareil n’ont pas pu être lus.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []));

  const shareSummary = async (report: Report) => {
    const category = REPORT_CATEGORIES.find((item) => item.id === report.categoryId)?.label ?? 'Autre situation';
    const summary = [
      'MAGUISSI BIRR — Résumé de signalement',
      `Référence locale : ${report.reference}`,
      `Catégorie : ${category}`,
      `Lieu : ${report.region}${report.locality ? ' — ' + report.locality : ''}`,
      `Statut local : ${statusLabel(report.status)}`,
      `Date : ${new Date(report.createdAt).toLocaleString('fr-FR')}`,
      '',
      'Description :',
      report.description,
      '',
      'Important : ces informations proviennent du stockage local de l’appareil. Elles ne prouvent pas que SES a reçu ou enregistré ce signalement. Vérifiez les destinataires avant de partager.'
    ].join('\n');
    try {
      await Share.share({ title: `Signalement ${report.reference}`, message: summary });
    } catch {
      Alert.alert('Partage indisponible', 'Le résumé n’a pas pu être partagé. Vous pouvez réessayer ou utiliser la préparation par e-mail.');
    }
  };

  const prepareEmail = (report: Report) => {
    const category = REPORT_CATEGORIES.find((item) => item.id === report.categoryId)?.label ?? 'Autre situation';
    const subject = `Signalement MAGUISSI BIRR — ${report.reference}`;
    const body = [
      'Bonjour,',
      '',
      'Je souhaite porter à votre attention le signalement suivant, enregistré localement dans MAGUISSI BIRR.',
      `Référence locale : ${report.reference}`,
      `Catégorie : ${category}`,
      `Lieu : ${report.region}${report.locality ? ' — ' + report.locality : ''}`,
      `Statut local : ${statusLabel(report.status)}`,
      `Date de création : ${new Date(report.createdAt).toLocaleString('fr-FR')}`,
      '',
      'Description :',
      report.description,
      '',
      'Note : cette référence et ce statut sont enregistrés sur mon appareil et ne constituent pas une confirmation de réception par SES.',
      '',
      'Cordialement'
    ].join('\n');
    Alert.alert(
      'Préparer un e-mail à SES ?',
      'Votre application de messagerie va s’ouvrir avec un résumé prérempli. Vérifiez les informations et envoyez vous-même le message. Aucun e-mail ne sera envoyé automatiquement par MAGUISSI BIRR.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: () => {
          const url = `mailto:${SES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          Linking.openURL(url).catch(() => Alert.alert('Messagerie indisponible', `Aucune application de messagerie compatible n’a pu être ouverte. Vous pouvez écrire à ${SES_EMAIL} depuis votre messagerie.`));
        } }
      ]
    );
  };

  const normalizedQuery = query.trim().toLocaleLowerCase('fr');
  const filteredReports = reports.filter((report) => [
    report.reference, report.description, report.region, report.locality ?? '',
    REPORT_CATEGORIES.find((category) => category.id === report.categoryId)?.label ?? ''
  ].some((value) => value.toLocaleLowerCase('fr').includes(normalizedQuery)))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return <ScrollView contentContainerStyle={styles.page}>
    <Text style={styles.intro}>Les signalements ci-dessous sont enregistrés sur cet appareil. Le suivi à distance sera disponible après mise en place de l'API sécurisée.</Text>
    <Text style={styles.emailNote}>Vous pouvez préparer manuellement un e-mail à SES pour transmettre un résumé. L’envoi reste sous votre contrôle et doit être confirmé dans votre messagerie.</Text>
    {!loading && reports.length > 0 && <TextInput value={query} onChangeText={setQuery} placeholder="Rechercher par référence, région ou texte…" placeholderTextColor={theme.colors.muted} style={styles.search} />}
    {loading ? <View accessibilityRole="progressbar" style={styles.loadingCard}><Text style={styles.empty}>Chargement de vos signalements…</Text></View> : reports.length === 0 ? <View style={styles.emptyCard}><Text style={styles.emptyIcon}>🗂️</Text><Text style={styles.emptyTitle}>Aucun signalement enregistré</Text><Text style={styles.empty}>Déclarez une situation environnementale ou QHSE pour conserver une trace sur cet appareil.</Text><Pressable accessibilityRole="button" onPress={() => router.push('/new-report')} style={styles.primaryButton}><Text style={styles.primaryButtonText}>＋ Créer un signalement</Text></Pressable></View> : filteredReports.length === 0 ? <View style={styles.emptyCard}><Text style={styles.emptyTitle}>Aucun résultat</Text><Text style={styles.empty}>Essayez une autre référence, région ou expression.</Text><Pressable accessibilityRole="button" onPress={() => setQuery('')} style={styles.clearButton}><Text style={styles.clearButtonText}>Effacer la recherche</Text></Pressable></View> : <><Text style={styles.resultCount}>{filteredReports.length} signalement{filteredReports.length > 1 ? 's' : ''} {normalizedQuery ? 'trouvé' + (filteredReports.length > 1 ? 's' : '') : 'enregistré' + (filteredReports.length > 1 ? 's' : '')} · du plus récent au plus ancien</Text>{filteredReports.map((report) => <View key={report.id} style={styles.card}>
      <Text style={styles.ref}>{report.reference}</Text>
      <Text style={styles.category}>{REPORT_CATEGORIES.find((category) => category.id === report.categoryId)?.label ?? 'Autre situation'}</Text>
      <Text style={styles.description}>{report.description}</Text>
      <Text style={styles.meta}>{report.region}{report.locality ? ' · ' + report.locality : ''}</Text>
      <Text style={styles.status}>{statusLabel(report.status)}</Text>
      <Text style={styles.meta}>{new Date(report.createdAt).toLocaleString('fr-FR')}</Text>
      <Pressable accessibilityRole="button" onPress={() => prepareEmail(report)} style={({ pressed }) => [styles.emailButton, pressed && { opacity: 0.8 }]}>
        <Text style={styles.emailButtonText}>Préparer un e-mail à SES</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => shareSummary(report)} style={({ pressed }) => [styles.shareButton, pressed && { opacity: 0.8 }]}>
        <Text style={styles.shareButtonText}>Partager le résumé…</Text>
      </Pressable>
    </View>)}</>}
  </ScrollView>;
}
const styles = StyleSheet.create({
  page: { padding: 18, gap: 12 },
  search: { backgroundColor: theme.colors.white, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: theme.colors.ink, fontSize: 14 },
  category: { color: theme.colors.forest, fontSize: 12, fontWeight: '800' },
  status: { alignSelf: 'flex-start', backgroundColor: theme.colors.mint, color: theme.colors.forest, borderRadius: 8, overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 5, fontSize: 11, fontWeight: '800' },
  intro: { color: theme.colors.muted, lineHeight: 21 },
  emailNote: { color: theme.colors.forest, backgroundColor: theme.colors.mint, padding: 13, borderRadius: 12, lineHeight: 19, fontSize: 13 },
  emptyCard: { marginTop: 24, padding: 24, alignItems: 'center', gap: 10, backgroundColor: theme.colors.white, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border },
  loadingCard: { padding: 24, alignItems: 'center', backgroundColor: theme.colors.white, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border },
  resultCount: { color: theme.colors.muted, fontSize: 12, fontWeight: '700', marginTop: 2 },
  primaryButton: { marginTop: 8, backgroundColor: theme.colors.forest, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 18, alignItems: 'center', alignSelf: 'stretch' },
  primaryButtonText: { color: theme.colors.white, fontWeight: '800', fontSize: 14 },
  clearButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.forest, marginTop: 4 },
  clearButtonText: { color: theme.colors.forest, fontWeight: '800' },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { color: theme.colors.ink, fontWeight: '800', fontSize: 16 },
  empty: { color: theme.colors.muted, textAlign: 'center', lineHeight: 20 },
  card: { backgroundColor: theme.colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border, gap: 7 },
  ref: { color: theme.colors.forest, fontWeight: '900' },
  description: { color: theme.colors.ink, fontWeight: '600' },
  meta: { color: theme.colors.muted, fontSize: 12 },
  emailButton: { marginTop: 5, backgroundColor: theme.colors.forest, paddingVertical: 12, paddingHorizontal: 14, alignItems: 'center', borderRadius: 12 },
  emailButtonText: { color: theme.colors.white, fontWeight: '800', fontSize: 13 },
  shareButton: { borderColor: theme.colors.forest, borderWidth: 1, paddingVertical: 11, paddingHorizontal: 14, alignItems: 'center', borderRadius: 12 },
  shareButtonText: { color: theme.colors.forest, fontWeight: '800', fontSize: 13 }
});
