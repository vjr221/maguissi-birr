import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

function ActionCard({ icon, title, detail, onPress }: { icon: string; title: string; detail: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, pressed && { opacity: 0.82 }]}>
    <View style={styles.actionIcon}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color={theme.colors.forest} /></View>
    <View style={{ flex: 1, gap: 4 }}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionDetail}>{detail}</Text></View>
    <Text style={styles.arrow}>›</Text>
  </Pressable>;
}

export default function HomeScreen() {
  return <ScrollView contentContainerStyle={styles.page}>
    <View style={styles.hero}>
      <View style={styles.brandHeader}><Image source={require('../assets/app-icon.png')} style={styles.brandLogo} resizeMode="contain" /><View><Text style={styles.brandName}>MAGUISSI <Text style={styles.brandNameAccent}>BIRR</Text></Text><Text style={styles.brandSlogan}>Signaler. Suivre. Agir.</Text></View></View>
      <Text style={styles.eyebrow}>ENSEMBLE, AGISSONS</Text>
      <Text style={styles.heroTitle}>Un environnement plus sûr commence par un signalement.</Text>
      <Text style={styles.heroBody}>Observez. Signalez. Suivez les actions.</Text>
      <Pressable accessibilityRole="button" onPress={() => router.push('/new-report')} style={styles.primary}><Ionicons name="alert-circle-outline" size={19} color={theme.colors.ink} /><Text style={styles.primaryText}>Faire un signalement</Text></Pressable>
      <View style={styles.heroFoot}><View style={styles.heroTag}><Ionicons name="leaf-outline" size={15} color="#E0F2E7" /><Text style={styles.heroFootText}>Environnement</Text></View><View style={styles.heroTag}><Ionicons name="shield-checkmark-outline" size={15} color="#E0F2E7" /><Text style={styles.heroFootText}>Santé & sécurité</Text></View></View>
    </View>
    <Text style={styles.sectionTitle}>Que souhaitez-vous faire ?</Text>
    <ActionCard icon="location-outline" title="Suivre un signalement" detail="Consultez votre historique et les statuts enregistrés" onPress={() => router.push('/reports')} />
    <ActionCard icon="leaf-outline" title="Conseils environnementaux" detail="Des gestes concrets pour prévenir les risques" onPress={() => router.push('/tips')} />
    <View style={styles.notice}><View style={styles.noticeHeading}><Ionicons name="shield-checkmark-outline" size={20} color="#715314" /><Text style={styles.noticeTitle}>Votre sécurité d’abord</Text></View><Text style={styles.noticeBody}>Ne vous exposez jamais à un danger pour recueillir des preuves. En cas d’urgence, contactez directement les services compétents.</Text></View>
    <Text style={styles.footer}>MAGUISSI BIRR · Signaler. Suivre. Agir.</Text>
  </ScrollView>;
}

const styles = StyleSheet.create({
  page: { padding: 18, paddingBottom: 36, gap: 16 },
  hero: { backgroundColor: theme.colors.forest, borderRadius: 28, padding: 22, paddingTop: 26, gap: 12, overflow: 'hidden' },
  brandHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  brandLogo: { width: 54, height: 54, borderRadius: 16, backgroundColor: theme.colors.white },
  brandName: { color: theme.colors.white, fontWeight: '900', fontSize: 20, letterSpacing: 0.3 },
  brandNameAccent: { color: theme.colors.gold },
  brandSlogan: { color: '#D7F0E0', fontSize: 11, fontWeight: '600', marginTop: 2, letterSpacing: 0.5 },
  brandMarkText: { color: theme.colors.forest, fontWeight: '900', fontSize: 17 },
  eyebrow: { color: '#BDE7CD', fontSize: 11, letterSpacing: 2, fontWeight: '800' },
  heroTitle: { color: theme.colors.white, fontSize: 28, lineHeight: 34, fontWeight: '800' },
  heroBody: { color: '#E0F2E7', fontSize: 15 },
  primary: { backgroundColor: theme.colors.gold, borderRadius: 14, padding: 15, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryText: { color: theme.colors.ink, fontWeight: '800', fontSize: 15 },
  heroFoot: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
  heroTag: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  heroFootText: { color: '#E0F2E7', fontSize: 12, fontWeight: '600' },
  sectionTitle: { color: theme.colors.ink, fontSize: 19, fontWeight: '800', marginTop: 4 },
  action: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: theme.colors.mint, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { color: theme.colors.ink, fontWeight: '800', fontSize: 15 },
  actionDetail: { color: theme.colors.muted, fontSize: 12, lineHeight: 17 },
  arrow: { color: theme.colors.forest, fontSize: 28, fontWeight: '500' },
  notice: { backgroundColor: '#FFF6DF', borderRadius: 16, padding: 16, gap: 6 },
  noticeHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  noticeTitle: { color: '#715314', fontWeight: '800' },
  noticeBody: { color: '#715F36', fontSize: 13, lineHeight: 19 },
  footer: { color: theme.colors.muted, fontSize: 11, textAlign: 'center', marginTop: 8 }
});
