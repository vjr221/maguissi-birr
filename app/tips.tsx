import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENVIRONMENT_TIPS } from '@/features/environment/tips';
import { theme } from '@/constants/theme';

const categoryVisual: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; background: string }> = {
  'Déchets': { icon: 'trash-outline', color: '#24724D', background: '#E6F4EA' },
  'Eau': { icon: 'water-outline', color: '#1769AA', background: '#E5F2FF' },
  'Énergie': { icon: 'flash-outline', color: '#9A6B00', background: '#FFF3D3' },
  'Sécurité': { icon: 'shield-checkmark-outline', color: '#B45309', background: '#FFF0E1' },
  'Biodiversité': { icon: 'leaf-outline', color: '#26734D', background: '#E8F5E9' },
  'Air': { icon: 'cloud-outline', color: '#536B82', background: '#EAF0F5' },
  'Travail': { icon: 'construct-outline', color: '#5751A3', background: '#EFEDFF' },
  'Chaleur': { icon: 'sunny-outline', color: '#B45309', background: '#FFF0D8' }
};

export default function TipsScreen() {
  return <ScrollView contentContainerStyle={styles.page}>
    <View style={styles.hero}>
      <View style={styles.heroArtwork}>
        <View style={styles.artCircle}><Ionicons name="leaf" size={31} color="#FFFFFF" /></View>
        <View style={styles.artSmallCircle}><Ionicons name="water" size={17} color="#1769AA" /></View>
        <View style={styles.artSmallCircleGold}><Ionicons name="sunny" size={17} color="#9A6B00" /></View>
      </View>
      <Text style={styles.eyebrow}>PRÉVENTION · QHSE · ENVIRONNEMENT</Text>
      <Text style={styles.heroTitle}>Les bons gestes font la différence.</Text>
      <Text style={styles.heroBody}>Des conseils pratiques pour prévenir les risques, protéger la santé et préserver les ressources naturelles.</Text>
    </View>
    <View style={styles.safetyNote}>
      <Ionicons name="shield-checkmark-outline" size={22} color="#715314" />
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={styles.safetyTitle}>La sécurité avant tout</Text>
        <Text style={styles.safetyBody}>Ne vous exposez jamais pour intervenir ou prendre une photo. Respectez les consignes de votre organisation et les instructions des autorités compétentes.</Text>
      </View>
    </View>
    <Text style={styles.sectionTitle}>Conseils à découvrir</Text>
    {ENVIRONMENT_TIPS.map((tip, index) => {
      const visual = categoryVisual[tip.category] ?? categoryVisual['Sécurité'];
      return <View key={tip.title} style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: visual.background }]}>
          <Ionicons name={visual.icon} size={25} color={visual.color} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardMeta}>
            <Text style={[styles.category, { color: visual.color }]}>{tip.category.toUpperCase()}</Text>
            <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
          </View>
          <Text style={styles.title}>{tip.title}</Text>
          <Text style={styles.body}>{tip.body}</Text>
        </View>
      </View>;
    })}
    <View style={styles.footerCard}>
      <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.forest} />
      <Text style={styles.footerText}>Un signalement précis et responsable aide les équipes compétentes à mieux comprendre une situation et à agir.</Text>
    </View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  page: { padding: 18, paddingBottom: 36, gap: 13 },
  hero: { backgroundColor: theme.colors.forest, borderRadius: 26, padding: 21, gap: 10, overflow: 'hidden' },
  heroArtwork: { height: 88, flexDirection: 'row', alignItems: 'center', marginBottom: 1 },
  artCircle: { width: 68, height: 68, borderRadius: 24, backgroundColor: '#2C8060', alignItems: 'center', justifyContent: 'center' },
  artSmallCircle: { width: 38, height: 38, borderRadius: 14, backgroundColor: '#E5F2FF', alignItems: 'center', justifyContent: 'center', marginLeft: -5, marginTop: 38, borderWidth: 3, borderColor: theme.colors.forest },
  artSmallCircleGold: { width: 36, height: 36, borderRadius: 13, backgroundColor: '#FFF3D3', alignItems: 'center', justifyContent: 'center', marginLeft: 10, marginTop: -24 },
  eyebrow: { color: '#BDE7CD', fontSize: 9, letterSpacing: 1.5, fontWeight: '900' },
  heroTitle: { color: theme.colors.white, fontSize: 25, lineHeight: 31, fontWeight: '900' },
  heroBody: { color: '#E0F2E7', fontSize: 14, lineHeight: 21 },
  safetyNote: { backgroundColor: '#FFF6DF', borderRadius: 17, padding: 15, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  safetyTitle: { color: '#715314', fontWeight: '900', fontSize: 14 },
  safetyBody: { color: '#715F36', fontSize: 12, lineHeight: 18 },
  sectionTitle: { color: theme.colors.ink, fontSize: 19, fontWeight: '900', marginTop: 5 },
  card: { backgroundColor: theme.colors.white, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 19, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconBox: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, gap: 7 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  category: { fontSize: 9, letterSpacing: 1.1, fontWeight: '900' },
  number: { color: theme.colors.muted, fontSize: 10, fontWeight: '800' },
  title: { color: theme.colors.ink, fontSize: 16, lineHeight: 21, fontWeight: '800' },
  body: { color: theme.colors.muted, lineHeight: 20, fontSize: 13 },
  footerCard: { backgroundColor: '#EAF4EE', borderRadius: 16, padding: 15, flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 3 },
  footerText: { flex: 1, color: theme.colors.forest, fontSize: 12, lineHeight: 18, fontWeight: '600' }
});
