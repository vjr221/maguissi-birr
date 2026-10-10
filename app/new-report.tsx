import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const [dangerImmediate, setDangerImmediate] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | undefined>();
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function addLocation() {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) return Alert.alert('Localisation non autorisée', 'Vous pouvez continuer sans coordonnées GPS.');
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    } catch { Alert.alert('Localisation indisponible', 'Réessayez ou continuez sans coordonnées.'); }
  }
  async function addPhoto() {
    if (photoUris.length >= 3) return Alert.alert('Limite de photos', 'Vous pouvez joindre au maximum 3 photos par signalement.');
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return Alert.alert('Accès aux photos refusé', 'Vous pouvez continuer sans photo.');
      const remaining = 3 - photoUris.length;
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.75, allowsMultipleSelection: true, selectionLimit: remaining });
      if (!result.canceled) setPhotoUris((current) => [...current, ...result.assets.map((asset) => asset.uri).filter((uri) => !current.includes(uri))].slice(0, 3));
    } catch {
      Alert.alert('Galerie indisponible', 'Vous pouvez continuer sans photo ou réessayer plus tard.');
    }
  }
  async function takePhoto() {
    if (photoUris.length >= 3) return Alert.alert('Limite de photos', 'Vous pouvez joindre au maximum 3 photos par signalement.');
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) return Alert.alert('Accès à la caméra refusé', 'Vous pouvez continuer sans photo.');
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.75 });
      if (!result.canceled && result.assets[0]) {
        setPhotoUris((current) => [...current, result.assets[0].uri].slice(0, 3));
      }
    } catch {
      Alert.alert('Caméra indisponible', 'Vous pouvez choisir une photo dans votre galerie.');
    }
  }
  async function submit() {
    if (saving) return;
    const validationError = validateDescription(description);
    if (validationError) return Alert.alert('Description à corriger', validationError);
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
      const referenceSuffix = Math.random().toString(36).slice(2, 10).toUpperCase();
      const report: Report = { id, reference: `MB-${new Date().getFullYear()}-${referenceSuffix}`, categoryId, description: description.trim(), dangerImmediate, region, locality: locality.trim() || undefined, ...coords, photoUris, createdAt: now, status: 'RECEIVED', events: [{ status: 'RECEIVED', at: now, note: 'Enregistré sur cet appareil' }] };
      await saveReport(report);
      Alert.alert('Signalement enregistré', `Référence locale : ${report.reference}. Elle est conservée sur cet appareil et n'a pas été transmise à un serveur.`, [
        { text: 'Partager la référence', onPress: () => { void Share.share({ message: `MAGUISSI BIRR — Référence locale ${report.reference}. Ce signalement n'a pas encore été transmis à un serveur.` }); } },
        { text: 'Voir mes signalements', onPress: () => router.replace('/reports') }
      ]);
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
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: dangerImmediate }} onPress={() => setDangerImmediate((value) => !value)} style={[styles.dangerToggle, dangerImmediate && styles.dangerToggleActive]}><Ionicons name={dangerImmediate ? 'checkbox' : 'square-outline'} size={24} color={dangerImmediate ? theme.colors.danger : theme.colors.muted} /><View style={{ flex: 1, gap: 3 }}><Text style={styles.dangerTitle}>Danger immédiat ?</Text><Text style={styles.dangerHelp}>Cochez uniquement si une personne, un site ou l’environnement semble exposé à un risque immédiat. Cela ne déclenche pas d’alerte à distance.</Text></View></Pressable>
    <Text style={styles.label}>3. Description</Text><TextInput value={description} onChangeText={setDescription} multiline textAlignVertical="top" maxLength={2000} placeholder="Que s’est-il passé ? Où ? Quand ? Y a-t-il un danger immédiat ?" placeholderTextColor={theme.colors.muted} style={[styles.input, styles.textarea]} /><Text style={styles.counter}>{description.length}/2000</Text>
    <Text style={styles.label}>4. Éléments complémentaires (facultatif)</Text>
    <View style={styles.row}><Pressable accessibilityRole="button" accessibilityLabel={coords ? 'Retirer les coordonnées GPS' : 'Ajouter ma position GPS'} onPress={() => coords ? setCoords(undefined) : void addLocation()} style={[styles.secondary, coords && styles.secondarySelected]}><Text style={styles.secondaryText}>{coords ? '✓ GPS ajouté · retirer' : '📍 Ajouter ma position'}</Text></Pressable><Pressable accessibilityRole="button" onPress={takePhoto} style={styles.secondary}><Text style={styles.secondaryText}>📸 Prendre une photo</Text></Pressable><Pressable accessibilityRole="button" onPress={addPhoto} style={styles.secondary}><Text style={styles.secondaryText}>🖼️ Galerie ({photoUris.length}/3)</Text></Pressable></View>
    {photoUris.length > 0 && <View style={styles.photoPreviewList}>{photoUris.map((uri, index) => <View key={uri + index} style={styles.photoPreviewItem}><Image source={{ uri }} accessibilityLabel={'Photo ' + (index + 1) + ' du signalement'} style={styles.photoPreview} /><Pressable accessibilityRole="button" accessibilityLabel={'Supprimer la photo ' + (index + 1)} onPress={() => setPhotoUris((current) => current.filter((item) => item !== uri))} style={styles.removePhoto}><Text style={styles.removePhotoText}>×</Text></Pressable></View>)}</View>}
    <Pressable accessibilityRole="button" disabled={saving} onPress={submit} style={[styles.submit, saving && { opacity: 0.6 }]}><Text style={styles.submitText}>{saving ? 'Enregistrement…' : 'Enregistrer le signalement'}</Text></Pressable>
    <Text style={styles.privacy}>Ne photographiez pas de personnes identifiables sans nécessité. Ne vous approchez pas de substances inconnues, d’un incendie ou d’une installation dangereuse.</Text>
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { padding: 18, gap: 12, paddingBottom: 32 }, dangerToggle: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 13, padding: 14, backgroundColor: theme.colors.white }, dangerToggleActive: { borderColor: theme.colors.danger, backgroundColor: '#FFF4F2' }, dangerTitle: { color: theme.colors.ink, fontSize: 15, fontWeight: '800' }, dangerHelp: { color: theme.colors.muted, fontSize: 12, lineHeight: 18 }, intro: { color: theme.colors.muted, lineHeight: 21, marginBottom: 4 }, label: { color: theme.colors.ink, fontSize: 15, fontWeight: '800', marginTop: 7 }, categories: { gap: 8 }, category: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, padding: 13, borderRadius: 12 }, categorySelected: { borderColor: theme.colors.forest, backgroundColor: theme.colors.mint }, regions: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, region: { paddingVertical: 9, paddingHorizontal: 11, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 999, backgroundColor: theme.colors.white }, regionSelected: { backgroundColor: theme.colors.forest, borderColor: theme.colors.forest }, regionText: { color: theme.colors.ink, fontSize: 12 }, regionTextSelected: { color: theme.colors.white, fontWeight: '800' }, input: { backgroundColor: theme.colors.white, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: theme.colors.ink, fontSize: 14 }, textarea: { minHeight: 130 }, counter: { textAlign: 'right', color: theme.colors.muted, fontSize: 11, marginTop: -7 }, row: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, photoPreviewList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 3 }, photoPreviewItem: { width: 86, height: 86, position: 'relative' }, photoPreview: { width: 86, height: 86, borderRadius: 12, backgroundColor: theme.colors.border }, removePhoto: { position: 'absolute', top: 4, right: 4, width: 25, height: 25, borderRadius: 13, backgroundColor: '#17211B', alignItems: 'center', justifyContent: 'center' }, removePhotoText: { color: '#FFFFFF', fontSize: 20, lineHeight: 22, fontWeight: '700' }, secondary: { flex: 1, borderWidth: 1, borderColor: theme.colors.forest, padding: 13, borderRadius: 12, alignItems: 'center' }, secondarySelected: { backgroundColor: theme.colors.mint }, secondaryText: { color: theme.colors.forest, fontWeight: '700', fontSize: 12 }, submit: { backgroundColor: theme.colors.forest, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 }, submitText: { color: theme.colors.white, fontWeight: '800' }, privacy: { color: theme.colors.muted, fontSize: 11, lineHeight: 17, marginTop: 4 } });
