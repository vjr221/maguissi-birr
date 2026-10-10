import { Linking, ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { SES_CONTACT } from '@/constants/contact';

const PHONE = SES_CONTACT.phone;
const WEBSITE = SES_CONTACT.website;
const EMAIL = SES_CONTACT.email;

async function openLink(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Impossible d’ouvrir le lien', 'Veuillez réessayer ou utiliser les coordonnées affichées.');
  }
}

function ContactAction({ icon, title, detail, onPress, accent = false }: {
  icon: keyof typeof Ionicons.glyphMap; title: string; detail: string; onPress: () => void; accent?: boolean;
}) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, accent && styles.actionAccent, pressed && { opacity: 0.8 }]}>
    <View style={[styles.iconBox, accent && styles.iconBoxAccent]}><Ionicons name={icon} size={23} color={accent ? theme.colors.white : theme.colors.forest} /></View>
    <View style={styles.actionText}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionDetail}>{detail}</Text></View>
    <Ionicons name="chevron-forward" size={19} color={accent ? theme.colors.white : theme.colors.muted} />
  </Pressable>;
}

export default function ContactScreen() {
  return <ScrollView contentContainerStyle={styles.page}>
    <View style={styles.hero}>
      <View style={styles.heroIcon}><Ionicons name="leaf" size={29} color={theme.colors.forest} /></View>
      <Text style={styles.eyebrow}>PARTENAIRE QHSE</Text>
      <Text style={styles.title}>Sen Environnement Services</Text>
      <Text style={styles.body}>Des solutions pour la qualité, l’hygiène, la sécurité et la protection de l’environnement.</Text>
      <Pressable accessibilityRole="button" onPress={() => openLink(WEBSITE)} style={styles.webButton}>
        <Ionicons name="globe-outline" size={19} color={theme.colors.ink} />
        <Text style={styles.webButtonText}>Découvrir le site de SES</Text>
      </Pressable>
    </View>

    <Text style={styles.sectionTitle}>Contacter le manager</Text>
    <View style={styles.contactCard}>
      <View style={styles.avatar}><Ionicons name="person" size={25} color={theme.colors.forest} /></View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={styles.manager}>M. Diallo</Text>
        <Text style={styles.muted}>Manager · Sen Environnement Services</Text>
        <Text style={styles.phone}>{'+221 77 475 21 21'}</Text>
      </View>
    </View>
    <ContactAction icon="call-outline" title="Appeler" detail="Contacter directement le manager" onPress={() => openLink('tel:' + PHONE)} accent />
    <ContactAction icon="logo-whatsapp" title="WhatsApp" detail="Envoyer un message à SES" onPress={() => openLink('https://wa.me/' + PHONE.replace('+', ''))} />
    <ContactAction icon="mail-outline" title="Envoyer un e-mail" detail={EMAIL} onPress={() => openLink('mailto:' + EMAIL)} />

    <Text style={styles.sectionTitle}>Services SES</Text>
    {[
      { icon: 'shield-checkmark-outline' as const, title: 'Conseil et accompagnement QHSE', detail: 'Analyse des risques, systèmes de management et amélioration continue.' },
      { icon: 'school-outline' as const, title: 'Formation et sensibilisation', detail: 'Développer les bons réflexes en matière de prévention et de sécurité.' },
      { icon: 'warning-outline' as const, title: 'Signalisation de sécurité', detail: 'Conception de panneaux adaptés aux besoins des sites professionnels.' },
      { icon: 'water-outline' as const, title: 'Eau, déchets et environnement', detail: 'Réduction des déchets, recyclage et gestion responsable des ressources.' },
      { icon: 'clipboard-outline' as const, title: 'Audit et consultance', detail: 'Évaluation des pratiques et recommandations adaptées aux organisations.' }
    ].map((service) => <View key={service.title} style={styles.service}>
      <View style={styles.serviceIcon}><Ionicons name={service.icon} size={21} color={theme.colors.forest} /></View>
      <View style={{ flex: 1, gap: 4 }}><Text style={styles.serviceTitle}>{service.title}</Text><Text style={styles.serviceDetail}>{service.detail}</Text></View>
    </View>)}

    <View style={styles.addressCard}>
      <Ionicons name="location-outline" size={22} color={theme.colors.forest} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.actionTitle}>Adresse</Text>
        <Text style={styles.actionDetail}>Thiès, route N° 1 Sindia–Mbour, Sénégal</Text>
        <Text style={styles.actionDetail}>Horaires indiqués sur le site : lundi–samedi</Text>
      </View>
    </View>
    <Pressable accessibilityRole="button" onPress={() => openLink(WEBSITE)} style={styles.linkButton}>
      <Text style={styles.linkText}>Voir tous les services sur le site officiel</Text>
      <Ionicons name="open-outline" size={17} color={theme.colors.forest} />
    </Pressable>
    <Text style={styles.disclaimer}>Les demandes envoyées depuis cette page ouvrent l’application correspondante sur votre téléphone. MAGUISSI BIRR ne transmet pas encore de demande à une plateforme de suivi SES.</Text>
  </ScrollView>;
}

const styles = StyleSheet.create({
  page: { padding: 18, paddingBottom: 36, gap: 13 },
  hero: { backgroundColor: theme.colors.forest, borderRadius: 26, padding: 22, gap: 10 },
  heroIcon: { width: 54, height: 54, borderRadius: 17, backgroundColor: theme.colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  eyebrow: { color: '#BDE7CD', fontSize: 11, letterSpacing: 1.8, fontWeight: '800' },
  title: { color: theme.colors.white, fontSize: 25, lineHeight: 31, fontWeight: '900' },
  body: { color: '#E0F2E7', fontSize: 14, lineHeight: 21 },
  webButton: { backgroundColor: theme.colors.gold, borderRadius: 13, padding: 13, marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  webButtonText: { color: theme.colors.ink, fontWeight: '800' },
  sectionTitle: { color: theme.colors.ink, fontSize: 19, fontWeight: '900', marginTop: 9 },
  contactCard: { backgroundColor: theme.colors.white, borderRadius: 18, borderWidth: 1, borderColor: theme.colors.border, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 54, height: 54, borderRadius: 18, backgroundColor: theme.colors.mint, alignItems: 'center', justifyContent: 'center' },
  manager: { color: theme.colors.ink, fontWeight: '900', fontSize: 17 },
  phone: { color: theme.colors.forest, fontWeight: '800', marginTop: 3 },
  muted: { color: theme.colors.muted, fontSize: 12 },
  action: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionAccent: { backgroundColor: theme.colors.forest, borderColor: theme.colors.forest },
  iconBox: { width: 43, height: 43, borderRadius: 13, backgroundColor: theme.colors.mint, alignItems: 'center', justifyContent: 'center' },
  iconBoxAccent: { backgroundColor: '#2D8061' },
  actionText: { flex: 1, gap: 3 },
  actionTitle: { color: theme.colors.ink, fontSize: 14, fontWeight: '800' },
  actionDetail: { color: theme.colors.muted, fontSize: 12, lineHeight: 17 },
  service: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  serviceIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: theme.colors.mint, alignItems: 'center', justifyContent: 'center' },
  serviceTitle: { color: theme.colors.ink, fontSize: 14, fontWeight: '800' },
  serviceDetail: { color: theme.colors.muted, fontSize: 12, lineHeight: 18 },
  addressCard: { backgroundColor: '#EEF5F0', borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 4 },
  linkButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, padding: 12 },
  linkText: { color: theme.colors.forest, fontWeight: '800' },
  disclaimer: { color: theme.colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 2 }
});
