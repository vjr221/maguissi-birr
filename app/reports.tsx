import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { listReports, restoreReportsFromBackup } from '@/services/reportStore';
import type { Report } from '@/types/report';
import { theme } from '@/constants/theme';
import { statusLabel } from '@/utils/reportValidation';
import { REPORT_CATEGORIES } from '@/constants/categories';
import { SES_CONTACT } from '@/constants/contact';
import { createReportBackup } from '@/utils/reportBackup';

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    listReports().then((items) => { if (active) { setReports(items); setLoadError(null); } })
      .catch((error: unknown) => {
        if (active) {
          const message = error instanceof Error ? error.message : 'Les signalements enregistrés sur cet appareil n’ont pas pu être lus.';
          setLoadError(message);
          Alert.alert('Données locales à vérifier', message);
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []));

  const exportBackup = async () => {
    if (loading || loadError) {
      Alert.alert('Sauvegarde indisponible', loading ? 'La lecture des données est en cours. Réessayez lorsque le chargement est terminé.' : 'Les données locales ne peuvent pas être lues correctement. Ne créez pas une sauvegarde vide ; conservez les données et la copie de secours pour diagnostic.');
      return;
    }
    if (reports.length === 0) {
      Alert.alert('Aucune donnée à sauvegarder', 'Créez d’abord un signalement.');
      return;
    }
    Alert.alert(
      'Exporter une sauvegarde JSON ?',
      'Le fichier contiendra les descriptions, les lieux et les éventuelles coordonnées GPS de vos signalements. Les photos ne sont pas incluses. Conservez ce fichier dans un endroit privé.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Créer la sauvegarde', onPress: () => { void (async () => {
          try {
            const directory = FileSystem.cacheDirectory;
            if (!directory) throw new Error('Le stockage temporaire est indisponible.');
            const uri = `${directory}maguissi-birr-backup-${Date.now()}.json`;
            await FileSystem.writeAsStringAsync(uri, createReportBackup(reports), { encoding: FileSystem.EncodingType.UTF8 });
            if (!(await Sharing.isAvailableAsync())) throw new Error('Le partage de fichiers n’est pas disponible sur cet appareil.');
            await Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle: 'Sauvegarder MAGUISSI BIRR' });
          } catch (error: unknown) {
            Alert.alert('Export impossible', error instanceof Error ? error.message : 'La sauvegarde n’a pas pu être créée.');
          }
        })(); } }
      ]
    );
  };

  const importBackup = async () => {
    if (loading || loadError) {
      Alert.alert('Restauration suspendue', loading ? 'La lecture des données est en cours. Réessayez lorsque le chargement est terminé.' : 'Les données locales actuelles ne sont pas lisibles. Aucune restauration ne sera tentée afin de protéger les données existantes.');
      return;
    }
    Alert.alert(
      'Restaurer une sauvegarde ?',
      'Les signalements valides seront ajoutés sans remplacer les dossiers déjà présents. Les doublons seront ignorés et les photos ne pourront pas être restaurées depuis ce fichier.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Choisir un fichier', onPress: () => { void (async () => {
          try {
            const picked = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/json', 'public.json'], copyToCacheDirectory: true, multiple: false });
            if (picked.canceled || !picked.assets[0]) return;
            const fileInfo = await FileSystem.getInfoAsync(picked.assets[0].uri);
            if (!fileInfo.exists || typeof fileInfo.size !== 'number') throw new Error('Impossible de vérifier la taille du fichier sélectionné.');
            if (fileInfo.size > 10 * 1024 * 1024) throw new Error('Le fichier de sauvegarde dépasse la limite de 10 Mo. Choisissez une sauvegarde plus petite.');
            const raw = await FileSystem.readAsStringAsync(picked.assets[0].uri, { encoding: FileSystem.EncodingType.UTF8 });
            const result = await restoreReportsFromBackup(raw);
            const refreshed = await listReports();
            setReports(refreshed);
            Alert.alert('Restauration terminée', `${result.added} signalement(s) ajouté(s), ${result.skipped} doublon(s) ignoré(s).`);
          } catch (error: unknown) {
            Alert.alert('Restauration impossible', error instanceof Error ? error.message : 'Le fichier n’a pas pu être restauré. Aucune donnée existante n’a été volontairement remplacée.');
          }
        })(); } }
      ]
    );
  };

  const shareSummary = async (report: Report) => {
    const category = REPORT_CATEGORIES.find((item) => item.id === report.categoryId)?.label ?? 'Autre situation';
    const summary = [
      'MAGUISSI BIRR — Résumé de signalement',
      `Référence locale : ${report.reference}`,
      `Catégorie : ${category}`,
      ...(report.dangerImmediate ? ['⚠️ DANGER IMMÉDIAT signalé par l’utilisateur'] : []),
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
      ...(report.dangerImmediate ? ['⚠️ DANGER IMMÉDIAT signalé par l’utilisateur'] : []),
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
          const url = `mailto:${SES_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          Linking.openURL(url).catch(() => Alert.alert('Messagerie indisponible', `Aucune application de messagerie compatible n’a pu être ouverte. Vous pouvez écrire à ${SES_CONTACT.email} depuis votre messagerie.`));
        } }
      ]
    );
  };

  const normalizedQuery = query.trim().toLocaleLowerCase('fr');
  const filteredReports = reports.filter((report) => [
    report.reference, report.description, report.region, report.locality ?? '', report.dangerImmediate ? 'danger immédiat urgence priorité' : '',
    REPORT_CATEGORIES.find((category) => category.id === report.categoryId)?.label ?? ''
  ].some((value) => value.toLocaleLowerCase('fr').includes(normalizedQuery)))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return <ScrollView contentContainerStyle={styles.page}>
    <Text style={styles.intro}>Les signalements ci-dessous sont enregistrés sur cet appareil. Le suivi à distance sera disponible après mise en place de l'API sécurisée.</Text>
    <Text style={styles.emailNote}>Vous pouvez préparer manuellement un e-mail à SES pour transmettre un résumé. L’envoi reste sous votre contrôle et doit être confirmé dans votre messagerie.</Text>
    <View style={styles.backupActions}>
      <Pressable accessibilityRole="button" onPress={exportBackup} style={styles.backupButton}><Text style={styles.backupButtonText}>Exporter la sauvegarde</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={importBackup} style={styles.restoreButton}><Text style={styles.restoreButtonText}>Restaurer un fichier</Text></Pressable>
    </View>
    {!loading && reports.length > 0 && <TextInput value={query} onChangeText={setQuery} placeholder="Rechercher par référence, région ou texte…" placeholderTextColor={theme.colors.muted} style={styles.search} />}
    {loading ? <View accessibilityRole="progressbar" style={styles.loadingCard}><Text style={styles.empty}>Chargement de vos signalements…</Text></View> : loadError ? <View style={styles.emptyCard}><Text style={styles.emptyIcon}>🛡️</Text><Text style={styles.emptyTitle}>Signalements indisponibles</Text><Text style={styles.empty}>Les données locales n’ont pas pu être lues. Cela ne signifie pas qu’il n’y a aucun signalement.</Text><Text style={styles.errorDetails}>{loadError}</Text><Text style={styles.empty}>Ne créez pas de sauvegarde vide et ne désinstallez pas l’application. La copie de récupération doit être préservée pour diagnostic.</Text></View> : reports.length === 0 ? <View style={styles.emptyCard}><Text style={styles.emptyIcon}>🗂️</Text><Text style={styles.emptyTitle}>Aucun signalement enregistré</Text><Text style={styles.empty}>Déclarez une situation environnementale ou QHSE pour conserver une trace sur cet appareil.</Text><Pressable accessibilityRole="button" onPress={() => router.push('/new-report')} style={styles.primaryButton}><Text style={styles.primaryButtonText}>＋ Créer un signalement</Text></Pressable></View> : filteredReports.length === 0 ? <View style={styles.emptyCard}><Text style={styles.emptyTitle}>Aucun résultat</Text><Text style={styles.empty}>Essayez une autre référence, région ou expression.</Text><Pressable accessibilityRole="button" onPress={() => setQuery('')} style={styles.clearButton}><Text style={styles.clearButtonText}>Effacer la recherche</Text></Pressable></View> : <><Text style={styles.resultCount}>{filteredReports.length} signalement{filteredReports.length > 1 ? 's' : ''} {normalizedQuery ? 'trouvé' + (filteredReports.length > 1 ? 's' : '') : 'enregistré' + (filteredReports.length > 1 ? 's' : '')} · du plus récent au plus ancien</Text>{filteredReports.map((report) => <View key={report.id} style={styles.card}>
      <Text style={styles.ref}>{report.reference}</Text>
      <Text style={styles.category}>{REPORT_CATEGORIES.find((category) => category.id === report.categoryId)?.label ?? 'Autre situation'}</Text>
      {report.dangerImmediate === true && <View accessibilityRole="text" accessibilityLabel="Danger immédiat signalé par l’utilisateur, appeler directement les secours si nécessaire" style={styles.dangerBadge}><Text style={styles.dangerBadgeText}>⚠ Danger immédiat signalé</Text></View>}
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
  backupActions: { flexDirection: 'row', gap: 10 },
  backupButton: { flex: 1, backgroundColor: theme.colors.forest, borderRadius: 11, paddingVertical: 12, paddingHorizontal: 10, alignItems: 'center' },
  backupButtonText: { color: theme.colors.white, fontWeight: '800', fontSize: 12, textAlign: 'center' },
  restoreButton: { flex: 1, borderColor: theme.colors.forest, borderWidth: 1, borderRadius: 11, paddingVertical: 12, paddingHorizontal: 10, alignItems: 'center' },
  restoreButtonText: { color: theme.colors.forest, fontWeight: '800', fontSize: 12, textAlign: 'center' },
  search: { backgroundColor: theme.colors.white, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: theme.colors.ink, fontSize: 14 },
  category: { color: theme.colors.forest, fontSize: 12, fontWeight: '800' },
  dangerBadge: { alignSelf: 'flex-start', backgroundColor: '#FFF0EE', borderColor: '#E8A8A2', borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 6 },
  dangerBadgeText: { color: '#9D2922', fontSize: 12, fontWeight: '900' },
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
  errorDetails: { color: theme.colors.danger, fontSize: 12, lineHeight: 18, textAlign: 'left', alignSelf: 'stretch' },
  card: { backgroundColor: theme.colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border, gap: 7 },
  ref: { color: theme.colors.forest, fontWeight: '900' },
  description: { color: theme.colors.ink, fontWeight: '600' },
  meta: { color: theme.colors.muted, fontSize: 12 },
  emailButton: { marginTop: 5, backgroundColor: theme.colors.forest, paddingVertical: 12, paddingHorizontal: 14, alignItems: 'center', borderRadius: 12 },
  emailButtonText: { color: theme.colors.white, fontWeight: '800', fontSize: 13 },
  shareButton: { borderColor: theme.colors.forest, borderWidth: 1, paddingVertical: 11, paddingHorizontal: 14, alignItems: 'center', borderRadius: 12 },
  shareButtonText: { color: theme.colors.forest, fontWeight: '800', fontSize: 13 }
});
