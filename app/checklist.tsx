import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

type CheckItem = { id: string; title: string; detail: string };
type CheckSection = { id: string; title: string; icon: keyof typeof Ionicons.glyphMap; color: string; background: string; items: CheckItem[] };

const CHECKLIST_KEY = 'maguissi-birr:prevention-checklist:v1';

const SECTIONS: CheckSection[] = [
  {
    id: 'people', title: 'Personnes et équipements', icon: 'shield-checkmark-outline', color: '#24724D', background: '#E6F4EA',
    items: [
      { id: 'ppe', title: 'Équipements de protection adaptés', detail: 'Vérifier leur disponibilité, leur état et leur adéquation au risque.' },
      { id: 'training', title: 'Consignes et autorisations comprises', detail: 'Confirmer que les personnes concernées connaissent les consignes applicables.' },
      { id: 'access', title: 'Circulations et issues dégagées', detail: 'Ne pas obstruer les accès, sorties de secours ou équipements de sécurité.' }
    ]
  },
  {
    id: 'environment', title: 'Environnement et ressources', icon: 'leaf-outline', color: '#1769AA', background: '#E5F2FF',
    items: [
      { id: 'waste', title: 'Déchets triés et contenants identifiés', detail: 'Séparer les flux selon les règles du site; ne jamais mélanger les déchets inconnus.' },
      { id: 'leaks', title: 'Absence de fuite ou déversement visible', detail: 'Ne pas toucher un produit inconnu; baliser la zone et alerter la personne compétente.' },
      { id: 'water', title: 'Eau et énergie utilisées raisonnablement', detail: 'Signaler les fuites, équipements inutilement actifs ou consommations anormales.' }
    ]
  },
  {
    id: 'workplace', title: 'Zone de travail', icon: 'construct-outline', color: '#8A5B13', background: '#FFF2D7',
    items: [
      { id: 'housekeeping', title: 'Zone propre et rangée', detail: 'Retirer les obstacles uniquement si cela peut être fait sans risque.' },
      { id: 'equipment', title: 'Équipements visiblement en bon état', detail: 'Ne pas utiliser un équipement endommagé; le signaler et le mettre hors service selon la procédure.' },
      { id: 'emergency', title: 'Moyens d’alerte connus', detail: 'Savoir comment alerter et où se trouvent les consignes d’urgence du site.' }
    ]
  }
];

export default function ChecklistScreen() {
  const [checked, setChecked] = useState<string[]>([]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(CHECKLIST_KEY).then((raw) => {
      if (!active || !raw) return;
      try {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) setChecked(parsed);
      } catch {
        // Ignore invalid local checklist data and start with an empty checklist.
      }
    }).catch(() => {
      // The checklist remains usable if local storage is temporarily unavailable.
    }).finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(CHECKLIST_KEY, JSON.stringify(checked)).catch(() => {
      // No server sync: a storage error must not block the checklist UI.
    });
  }, [checked, loaded]);
  const allItems = useMemo(() => SECTIONS.flatMap((section) => section.items), []);
  const completed = allItems.filter((item) => checked.includes(item.id)).length;
  const progress = Math.round((completed / allItems.length) * 100);

  const toggle = (id: string) => {
    setChecked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setAcknowledged(false);
  };
  const reset = () => Alert.alert('Réinitialiser la checklist ?', 'Les coches de cette vérification seront effacées.', [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Réinitialiser', style: 'destructive', onPress: () => { setChecked([]); setAcknowledged(false); } }
  ]);

  return <ScrollView contentContainerStyle={styles.page}>
    <View style={styles.hero}>
      <View style={styles.heroIcon}><Ionicons name="clipboard-outline" size={27} color={theme.colors.forest} /></View>
      <Text style={styles.eyebrow}>PRÉVENTION · CONTRÔLE VISUEL</Text>
      <Text style={styles.heroTitle}>Les bons réflexes avant d’agir.</Text>
      <Text style={styles.heroBody}>Une aide-mémoire simple pour repérer les points à vérifier dans une zone de travail ou un environnement d’activité.</Text>
      <Text style={styles.savedNote}>{loaded ? 'Votre progression est conservée sur cet appareil.' : 'Récupération de votre progression…'}</Text>
      <View style={styles.progressTop}><Text style={styles.progressLabel}>Points vérifiés</Text><Text style={styles.progressValue}>{completed}/{allItems.length}</Text></View>
      <View style={styles.progressTrack}><View style={[styles.progressFill, { width: progress + '%' }]} /></View>
    </View>

    <View style={styles.warning}>
      <Ionicons name="warning-outline" size={22} color="#8A5B13" />
      <Text style={styles.warningText}>Cette checklist est un aide-mémoire général, pas une certification de conformité ni un remplacement des procédures, permis de travail ou évaluations des risques du site.</Text>
    </View>

    {SECTIONS.map((section) => {
      const sectionDone = section.items.filter((item) => checked.includes(item.id)).length;
      return <View key={section.id} style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: section.background }]}><Ionicons name={section.icon} size={22} color={section.color} /></View>
          <View style={{ flex: 1, gap: 2 }}><Text style={styles.sectionTitle}>{section.title}</Text><Text style={styles.sectionCount}>{sectionDone}/{section.items.length} points vérifiés</Text></View>
        </View>
        {section.items.map((item) => {
          const active = checked.includes(item.id);
          return <Pressable key={item.id} accessibilityRole="checkbox" accessibilityState={{ checked: active }} onPress={() => toggle(item.id)} style={styles.checkRow}>
            <View style={[styles.checkbox, active && styles.checkboxActive]}>{active && <Ionicons name="checkmark" size={17} color="#FFFFFF" />}</View>
            <View style={{ flex: 1, gap: 4 }}><Text style={[styles.itemTitle, active && styles.itemTitleActive]}>{item.title}</Text><Text style={styles.itemDetail}>{item.detail}</Text></View>
          </Pressable>;
        })}
      </View>;
    })}

    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: acknowledged }} onPress={() => setAcknowledged((value) => !value)} style={styles.ackRow}>
      <View style={[styles.checkbox, acknowledged && styles.checkboxActive]}>{acknowledged && <Ionicons name="checkmark" size={17} color="#FFFFFF" />}</View>
      <Text style={styles.ackText}>J’ai compris qu’une situation dangereuse doit être signalée et qu’il ne faut jamais intervenir sans autorisation ni protection adaptée.</Text>
    </Pressable>
    <View style={styles.actions}>
      <Pressable accessibilityRole="button" onPress={reset} style={styles.secondaryButton}><Ionicons name="refresh-outline" size={17} color={theme.colors.forest} /><Text style={styles.secondaryText}>Recommencer</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={() => Alert.alert('Vérification locale', 'Votre progression est affichée sur cet écran. Elle n’est ni transmise à SES ni enregistrée comme une inspection officielle.', [{ text: 'Compris' }])} style={styles.primaryButton}><Ionicons name="information-circle-outline" size={18} color="#FFFFFF" /><Text style={styles.primaryText}>À propos du résultat</Text></Pressable>
    </View>
    <Text style={styles.footer}>MAGUISSI BIRR · Prévenir les risques, protéger les personnes et l’environnement.</Text>
  </ScrollView>;
}

const styles = StyleSheet.create({
  page: { padding: 17, paddingBottom: 36, gap: 14 },
  hero: { backgroundColor: theme.colors.forest, borderRadius: 25, padding: 20, gap: 10 },
  heroIcon: { width: 52, height: 52, borderRadius: 17, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: '#BDE7CD', fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
  heroTitle: { color: '#FFFFFF', fontSize: 25, lineHeight: 31, fontWeight: '900' },
  heroBody: { color: '#E0F2E7', fontSize: 13, lineHeight: 20 },
  savedNote: { color: '#BDE7CD', fontSize: 10, fontWeight: '700' },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  progressLabel: { color: '#D7F0E0', fontSize: 12, fontWeight: '700' },
  progressValue: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  progressTrack: { height: 8, backgroundColor: '#3B8065', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: theme.colors.gold, borderRadius: 999 },
  warning: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 13, borderRadius: 14, backgroundColor: '#FFF2D7' },
  warningText: { flex: 1, color: '#73551D', fontSize: 11, lineHeight: 17 },
  sectionCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 18, padding: 14, gap: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 8 },
  sectionIcon: { width: 43, height: 43, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { color: theme.colors.ink, fontSize: 15, fontWeight: '900' },
  sectionCount: { color: theme.colors.muted, fontSize: 10, fontWeight: '700' },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEF1EE' },
  checkbox: { width: 23, height: 23, borderRadius: 7, borderWidth: 1.5, borderColor: '#A9B8AE', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxActive: { backgroundColor: theme.colors.forest, borderColor: theme.colors.forest },
  itemTitle: { color: theme.colors.ink, fontSize: 12, lineHeight: 17, fontWeight: '800' },
  itemTitleActive: { color: theme.colors.forest },
  itemDetail: { color: theme.colors.muted, fontSize: 11, lineHeight: 16 },
  ackRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 13, borderRadius: 14, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: '#FFFFFF' },
  ackText: { flex: 1, color: theme.colors.ink, fontSize: 11, lineHeight: 17 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 13, paddingVertical: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: '#FFFFFF', borderRadius: 12 },
  secondaryText: { color: theme.colors.forest, fontSize: 11, fontWeight: '900' },
  primaryButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 13, paddingVertical: 12, backgroundColor: theme.colors.forest, borderRadius: 12 },
  primaryText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
  footer: { color: theme.colors.muted, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 3 }
});
