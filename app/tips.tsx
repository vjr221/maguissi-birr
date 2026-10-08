import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ENVIRONMENT_TIPS } from '@/features/environment/tips';
import { theme } from '@/constants/theme';

export default function TipsScreen() {
  return <ScrollView contentContainerStyle={styles.page}>
    <Text style={styles.intro}>Des gestes simples réduisent les risques et protègent les ressources naturelles. Adaptez toujours ces conseils aux consignes des autorités locales.</Text>
    {ENVIRONMENT_TIPS.map((tip) => <View key={tip.title} style={styles.card}><Text style={styles.category}>{tip.category.toUpperCase()}</Text><Text style={styles.title}>{tip.title}</Text><Text style={styles.body}>{tip.body}</Text></View>)}
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { padding: 18, gap: 12 }, intro: { color: theme.colors.muted, lineHeight: 22, marginBottom: 4 }, card: { backgroundColor: theme.colors.white, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 18, padding: 17, gap: 8 }, category: { color: theme.colors.forest, fontSize: 10, letterSpacing: 1.5, fontWeight: '900' }, title: { color: theme.colors.ink, fontSize: 17, fontWeight: '800' }, body: { color: theme.colors.muted, lineHeight: 21, fontSize: 14 } });
