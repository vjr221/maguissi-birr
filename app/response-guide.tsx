import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

type GuideStep = { title: string; body: string };
type GuideScenario = { icon: keyof typeof Ionicons.glyphMap; title: string; color: string; background: string; steps: GuideStep[] };

const PRIORITIES: GuideStep[] = [
  { title: '1. Protéger', body: 'Éloignez-vous du danger et ne vous exposez pas pour obtenir une photo ou recueillir des preuves. N’intervenez que si vous êtes formé, autorisé et équipé.' },
  { title: '2. Alerter', body: 'Prévenez immédiatement le responsable du site et les secours adaptés selon la procédure locale. Donnez le lieu précis, la nature apparente du danger et les personnes potentiellement exposées.' },
  { title: '3. Éloigner et baliser si possible sans risque', body: 'Empêchez l’accès à la zone uniquement si vous pouvez le faire sans vous mettre en danger. Ne touchez pas aux équipements, substances ou objets inconnus.' },
  { title: '4. Signaler et transmettre les faits', body: 'Une fois la situation sécurisée, consignez l’heure, le lieu, les faits observés et les mesures déjà prises. Séparez clairement les faits des suppositions.' }
];

const SCENARIOS: GuideScenario[] = [
  { icon: 'flame-outline', title: 'Feu, fumée ou explosion', color: '#A52D25', background: '#FCEBE8', steps: [
    { title: 'Évacuez et alertez', body: 'Suivez le plan d’évacuation et les consignes du site. N’utilisez pas un ascenseur et ne tentez pas d’éteindre un feu qui dépasse vos moyens ou votre formation.' }
  ] },
  { icon: 'water-outline', title: 'Fuite ou déversement inconnu', color: '#246A9A', background: '#E8F3FC', steps: [
    { title: 'Ne touchez pas au produit', body: 'Évitez le contact et l’inhalation, éloignez les personnes si cela peut se faire sans risque et alertez le personnel compétent. Ne rincez pas le produit vers un drain et ne mélangez aucun produit.' }
  ] },
  { icon: 'medkit-outline', title: 'Blessure ou malaise', color: '#9A5B16', background: '#FFF2DD', steps: [
    { title: 'Alertez les secours compétents', body: 'Assurez d’abord la sécurité de la zone. Apportez uniquement l’aide pour laquelle vous êtes formé; ne déplacez pas une personne blessée sauf danger immédiat.' }
  ] },
  { icon: 'flash-outline', title: 'Risque électrique ou machine', color: '#6C4AA1', background: '#F1EAFE', steps: [
    { title: 'N’approchez pas et ne redémarrez pas', body: 'Gardez vos distances, empêchez l’accès si cela est sûr et demandez une mise en sécurité par une personne habilitée. Ne touchez jamais une victime encore en contact avec une source électrique.' }
  ] }
];

function StepCard({ step, index }: { step: GuideStep; index: number }) {
  return <View style={styles.stepRow}><View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View><View style={styles.stepCopy}><Text style={styles.stepTitle}>{step.title}</Text><Text style={styles.body}>{step.body}</Text></View></View>;
}

async function callEmergency(number: string) {
  try {
    await Linking.openURL(`tel:${number}`);
  } catch {
    Alert.alert('Appel indisponible', `Impossible d’ouvrir le téléphone. Composez directement le ${number} si vous êtes en mesure de le faire.`);
  }
}

export default function ResponseGuideScreen() {
  return <ScrollView contentContainerStyle={styles.page}>
    <View style={styles.hero}>
      <View style={styles.heroIcon}><Ionicons name="shield-checkmark-outline" size={27} color={theme.colors.forest} /></View>
      <Text style={styles.eyebrow}>GUIDE TERRAIN · QHSE</Text>
      <Text style={styles.heroTitle}>Face au danger, les bons réflexes.</Text>
      <Text style={styles.heroBody}>Un mémo pratique pour réagir sans aggraver la situation. Les consignes d’urgence du site et les secours compétents restent prioritaires.</Text>
    </View>
    <View style={styles.critical}><Ionicons name="alert-circle" size={23} color={theme.colors.danger} /><View style={{ flex: 1 }}><Text style={styles.criticalTitle}>Danger immédiat ?</Text><Text style={styles.body}>N’attendez pas de remplir l’application. Éloignez-vous, alertez immédiatement les secours et appliquez la procédure d’urgence locale.</Text></View></View>
    <View style={styles.emergencyCard}>
      <Text style={styles.emergencyTitle}>Appeler les secours au Sénégal</Text>
      <Text style={styles.emergencyNote}>En cas de danger, appelez directement les secours. MAGUISSI BIRR ne transmet pas d’alerte automatiquement.</Text>
      <View style={styles.emergencyActions}>
        <Pressable accessibilityRole="button" accessibilityLabel="Appeler les pompiers au 18" onPress={() => void callEmergency('18')} style={styles.emergencyButton}><Text style={styles.emergencyNumber}>18</Text><Text style={styles.emergencyLabel}>Pompiers</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Appeler la police au 17" onPress={() => void callEmergency('17')} style={styles.emergencyButton}><Text style={styles.emergencyNumber}>17</Text><Text style={styles.emergencyLabel}>Police secours</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Appeler le SAMU au 1515" onPress={() => void callEmergency('1515')} style={styles.emergencyButton}><Text style={styles.emergencyNumber}>1515</Text><Text style={styles.emergencyLabel}>SAMU</Text></Pressable>
      </View>
    </View>
    <Text style={styles.sectionTitle}>Les 4 priorités</Text>
    <View style={styles.card}>{PRIORITIES.map((step, index) => <StepCard key={step.title} step={step} index={index} />)}</View>
    <Text style={styles.sectionTitle}>Réflexes selon la situation</Text>
    {SCENARIOS.map((scenario) => <View key={scenario.title} style={styles.scenario}>
      <View style={[styles.scenarioIcon, { backgroundColor: scenario.background }]}><Ionicons name={scenario.icon} size={23} color={scenario.color} /></View>
      <View style={{ flex: 1, gap: 7 }}><Text style={styles.scenarioTitle}>{scenario.title}</Text>{scenario.steps.map((step) => <View key={step.title}><Text style={styles.stepTitle}>{step.title}</Text><Text style={styles.body}>{step.body}</Text></View>)}</View>
    </View>)}
    <View style={styles.notice}><Ionicons name="information-circle-outline" size={22} color={theme.colors.forest} /><View style={{ flex: 1, gap: 5 }}><Text style={styles.noticeTitle}>Après la mise en sécurité</Text><Text style={styles.body}>Enregistrez un signalement factuel dans MAGUISSI BIRR et suivez la procédure de votre organisation. Les signalements de cette version sont conservés sur l’appareil : l’application ne prévient pas automatiquement une équipe d’intervention.</Text></View></View>
    <Text style={styles.footer}>Ce guide est un aide-mémoire général. Il ne remplace ni la formation, ni l’évaluation des risques, ni les procédures d’urgence du site.</Text>
  </ScrollView>;
}

const styles = StyleSheet.create({
  page: { padding: 18, paddingBottom: 34, gap: 15 },
  hero: { backgroundColor: theme.colors.mint, borderRadius: theme.radius.lg, padding: 22, gap: 10 },
  heroIcon: { width: 52, height: 52, borderRadius: 17, backgroundColor: theme.colors.white, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 11, letterSpacing: 1.4, fontWeight: '800', color: theme.colors.forest },
  heroTitle: { color: theme.colors.ink, fontSize: 27, lineHeight: 33, fontWeight: '800' },
  heroBody: { color: theme.colors.muted, fontSize: 14, lineHeight: 21 },
  critical: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16, borderWidth: 1, borderColor: '#F1C5C1', borderRadius: theme.radius.md, backgroundColor: '#FFF4F2' },
  criticalTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.danger, marginBottom: 4 },
  emergencyCard: { backgroundColor: theme.colors.white, borderRadius: theme.radius.md, padding: 15, borderWidth: 1, borderColor: '#F1C5C1', gap: 10 },
  emergencyTitle: { color: theme.colors.ink, fontSize: 17, fontWeight: '800' },
  emergencyNote: { color: theme.colors.muted, fontSize: 12, lineHeight: 18 },
  emergencyActions: { flexDirection: 'row', gap: 8 },
  emergencyButton: { flex: 1, minHeight: 68, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF4F2', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1C5C1' },
  emergencyNumber: { color: theme.colors.danger, fontSize: 23, fontWeight: '900' },
  emergencyLabel: { color: theme.colors.ink, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  sectionTitle: { color: theme.colors.ink, fontSize: 19, fontWeight: '800', marginTop: 3 },
  card: { backgroundColor: theme.colors.white, borderRadius: theme.radius.md, padding: 16, borderWidth: 1, borderColor: theme.colors.border, gap: 18 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: theme.colors.mint, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: theme.colors.forest, fontSize: 14, fontWeight: '800' },
  stepCopy: { flex: 1, gap: 5 },
  stepTitle: { color: theme.colors.ink, fontSize: 15, fontWeight: '800' },
  body: { color: theme.colors.muted, fontSize: 13, lineHeight: 19 },
  scenario: { flexDirection: 'row', alignItems: 'flex-start', gap: 13, padding: 16, backgroundColor: theme.colors.white, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border },
  scenarioIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  scenarioTitle: { color: theme.colors.ink, fontSize: 16, fontWeight: '800' },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 16, borderRadius: theme.radius.md, backgroundColor: theme.colors.mint },
  noticeTitle: { color: theme.colors.forest, fontSize: 15, fontWeight: '800' },
  footer: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', paddingHorizontal: 8 }
});
