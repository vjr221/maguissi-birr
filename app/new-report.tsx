import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { REPORT_CATEGORIES, REGIONS } from '@/constants/categories';
import { theme } from '@/constants/theme';
import { saveReport } from '@/services/reportStore';
import type { Report } from '@/types/report';
import { validateDescription } from '@/utils/reportValidation';

export default function NewReportScreen() {
  const [categoryId, setCategoryId] = useState<string>('environment');
  const [region, setRegion] = useState('Dakar');
  const [locality, setLocality] = useState('');
  const [description, setDescription] = useState('');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | undefined>();
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function addLocation() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) return Alert.alert('Localisation non autorisée', 'Vous pouvez continuer sans coordonnées GPS.');
    try { const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }); setCoords({ latitude: location.coords.latitude, longitude: location.coords.longitude }); }
    catch { Alert.alert('Localisation indisponible', 'Réessayez ou continuez sans coordonnées.'); }
  }
  async function addPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('Accès aux photos refusé', 'Vous pouvez continuer sans photo.');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.75, allowsMultipleSelection: true, selectionLimit: 3 });
    if (!result.canceled) setPhotoUris(result.assets.slice(0, 3).map((asset) => asset.uri));
  }
  async function submit() {
    const validationError = validateDescription(description);
    if (validationError) return Alert.alert('Description à corriger', validationError);
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const id = `${Date.now()}`;
      const report: Report = { id, reference: `MB-${new Date().getFullYear()}-${id.slice(-6)}`, categoryId, description: description.trim(), region, locality: locality.trim() || undefined, ...coords, photoUris, createdAt: now, status: 'RECEIVED', events: [{ status: 'RECEIVED', at: now, note: 'Enregistré sur cet appareil' }] };
      await saveReport(report);
      Alert.alert('Signalement enregistré', `Votre référence locale : ${report.reference}. Elle est enregistrée sur cet appareil et n'a pas encore été transmise à un serveur.`, [{ text: 'Voir mes signalements', onPress: () => router.replace('/reports') }]);
    } catch { Alert.alert('Enregistrement impossible', 'Vérifiez l’espace disponible puis réessayez.'); }
    finally { setSaving(false); }
  }

  return <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <Text style={styles.intro}>Décrivez la situation sans vous exposer à un danger. Les informations restent sur cet appareil dans cette version.</Text>
    <Text style={styles.label}>1. Catégorie</Text>
    <View style={styles.categories}>{REPORT_CATEGORIES.map((cat) => <Pressable key={cat.id} accessibilityRole="button" accessibilityState={{ selected: categoryId === cat.id }} onPress={() => setCategoryId(cat.id)} style={[styles.category, categoryId === cat.id && styles.categorySelected]}><Text>{cat.icon} {cat.label}</Text></Pressable>)}</View>
    <Text style={styles.label}>2. Région</Text>
    <View style={styles.regions}>{REGIONS.map((item) => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: region === item }} onPress={() => setRegion(item)} style={[styles.region, region === item && styles.regionSelected]}><Text style={[styles.regionText, region === item && styles.regionTextSelected]}>{item}</Text></Pressable>)}</View>
    <Text style={styles.label}>Localité ou repère (facultatif)</Text><TextInput value={locality} onChangeText={setLocality} placeholder="Commune, quartier, rue…" placeholderTextColor={theme.colors.muted} style={styles.input} />
    <Text style={styles.label}>3. Description</Text><TextInput value={description} onChangeText={setDescription} multiline textAlignVertical="top" maxLength={2000} placeholder="Que s’est-il passé ? Où ? Quand ? Y a-t-il un danger immédiat ?" placeholderTextColor={theme.colors.muted} style={[styles.input, styles.textarea]} /><Text style={styles.counter}>{description.length}/2000</Text>
    <Text style={styles.label}>4. Éléments complémentaires (facultatif)</Text>
    <View style={styles.row}><Pressable accessibilityRole="button" onPress={addLocation} style={styles.secondary}><Text style={styles.secondaryText}>{coords ? '✓ GPS ajouté' : '📍 Ajouter ma position'}</Text></Pressable><Pressable accessibilityRole="button" onPress={addPhoto} style={styles.secondary}><Text style={styles.secondaryText}>📷 Photos ({photoUris.length})</Text></Pressable></View>
    <Pressable accessibilityRole="button" disabled={saving} onPress={submit} style={[styles.submit, saving && { opacity: 0.6 }]}><Text style={styles.submitText}>{saving ? 'Enregistrement…' : 'Enregistrer le signalement'}</Text></Pressable>
    <Text style={styles.privacy}>Ne photographiez pas de personnes identifiables sans nécessité. Ne vous approchez pas de substances inconnues, d’un incendie ou d’une installation dangereuse.</Text>
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { padding: 18, gap: 12, paddingBottom: 32 }, intro: { color: theme.colors.muted, lineHeight: 21, marginBottom: 4 }, label: { color: theme.colors.ink, fontSize: 15, fontWeight: '800', marginTop: 7 }, categories: { gap: 8 }, category: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, padding: 13, borderRadius: 12 }, categorySelected: { borderColor: theme.colors.forest, backgroundColor: theme.colors.mint }, regions: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, region: { paddingVertical: 9, paddingHorizontal: 11, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 999, backgroundColor: theme.colors.white }, regionSelected: { backgroundColor: theme.colors.forest, borderColor: theme.colors.forest }, regionText: { color: theme.colors.ink, fontSize: 12 }, regionTextSelected: { color: theme.colors.white, fontWeight: '800' }, input: { backgroundColor: theme.colors.white, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: theme.colors.ink, fontSize: 14 }, textarea: { minHeight: 130 }, counter: { textAlign: 'right', color: theme.colors.muted, fontSize: 11, marginTop: -7 }, row: { flexDirection: 'row', gap: 9 }, secondary: { flex: 1, borderWidth: 1, borderColor: theme.colors.forest, padding: 13, borderRadius: 12, alignItems: 'center' }, secondaryText: { color: theme.colors.forest, fontWeight: '700', fontSize: 12 }, submit: { backgroundColor: theme.colors.forest, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 }, submitText: { color: theme.colors.white, fontWeight: '800' }, privacy: { color: theme.colors.muted, fontSize: 11, lineHeight: 17, marginTop: 4 } });
