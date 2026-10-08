import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { theme } from '@/constants/theme';

function ActionCard({ icon, title, detail, onPress }: { icon: string; title: string; detail: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, pressed && { opacity: 0.82 }]}>
    <View style={styles.actionIcon}><Text style={{ fontSize: 24 }}>{icon}</Text></View>
    <View style={{ flex: 1, gap: 4 }}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionDetail}>{detail}</Text></View>
    <Text style={styles.arrow}>›</Text>
  </Pressable>;
}

export default function HomeScreen() {
  return <ScrollView contentContainerStyle={styles.page}>
    <View style={styles.hero}>
      <View style={styles.brandMark}><Text style={styles.brandMarkText}>MB</Text></View>
      <Text style={styles.eyebrow}>ENSEMBLE, AGISSONS</Text>
      <Text style={styles.heroTitle}>Un environnement plus sûr commence par un signalement.</Text>
      <Text style={styles.heroBody}>Observez. Signalez. Suivez les actions.</Text>
      <Pressable accessibilityRole="button" onPress={() => router.push('/new-report')} style={styles.primary}><Text style={styles.primaryText}>＋  Faire un signalement</Text></Pressable>
      <View style={styles.heroFoot}><Text style={styles.heroFootText}>🌱 Environnement</Text><Text style={styles.heroFootText}>🦺 Santé & sécurité</Text></View>
    </View>
    <Text style={styles.sectionTitle}>Que souhaitez-vous faire ?</Text>
    <ActionCard icon="📍" title="Suivre un signalement" detail="Consultez votre historique et les statuts enregistrés" onPress={() => router.push('/reports')} />
    <ActionCard icon="🌿" title="Conseils environnementaux" detail="Des gestes concrets pour prévenir les risques" onPress={() => router.push('/tips')} />
    <View style={styles.notice}><Text style={styles.noticeTitle}>Votre sécurité d’abord</Text><Text style={styles.noticeBody}>Ne vous exposez jamais à un danger pour recueillir des preuves. En cas d’urgence, contactez directement les services compétents.</Text></View>
    <Text style={styles.footer}>MAGUISSI BIRR · Signaler. Suivre. Agir.</Text>
  </ScrollView>;
}

const styles = StyleSheet.create({
  page: { padding: 18, paddingBottom: 36, gap: 16 },
  hero: { backgroundColor: theme.colors.forest, borderRadius: 28, padding: 22, paddingTop: 26, gap: 12, overflow: 'hidden' },
  brandMark: { width: 48, height: 48, borderRadius: 16, backgroundColor: theme.colors.white, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: theme.colors.forest, fontWeight: '900', fontSize: 17 },
  eyebrow: { color: '#BDE7CD', fontSize: 11, letterSpacing: 2, fontWeight: '800' },
  heroTitle: { color: theme.colors.white, fontSize: 28, lineHeight: 34, fontWeight: '800' },
  heroBody: { color: '#E0F2E7', fontSize: 15 },
  primary: { backgroundColor: theme.colors.gold, borderRadius: 14, padding: 15, alignItems: 'center', marginTop: 4 },
  primaryText: { color: theme.colors.ink, fontWeight: '800', fontSize: 15 },
  heroFoot: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
  heroFootText: { color: '#E0F2E7', fontSize: 12, fontWeight: '600' },
  sectionTitle: { color: theme.colors.ink, fontSize: 19, fontWeight: '800', marginTop: 4 },
  action: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: theme.colors.mint, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { color: theme.colors.ink, fontWeight: '800', fontSize: 15 },
  actionDetail: { color: theme.colors.muted, fontSize: 12, lineHeight: 17 },
  arrow: { color: theme.colors.forest, fontSize: 28, fontWeight: '500' },
  notice: { backgroundColor: '#FFF6DF', borderRadius: 16, padding: 16, gap: 6 },
  noticeTitle: { color: '#715314', fontWeight: '800' },
  noticeBody: { color: '#715F36', fontSize: 13, lineHeight: 19 },
  footer: { color: theme.colors.muted, fontSize: 11, textAlign: 'center', marginTop: 8 }
});
