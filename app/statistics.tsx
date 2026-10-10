import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listReports } from '@/services/reportStore';
import type { Report } from '@/types/report';
import { REPORT_CATEGORIES } from '@/constants/categories';
import { theme } from '@/constants/theme';
import { statusLabel } from '@/utils/reportValidation';

type Period = 'all' | '30' | '7';
const PERIODS: { id: Period; label: string }[] = [
  { id: 'all', label: 'Tout' }, { id: '30', label: '30 jours' }, { id: '7', label: '7 jours' }
];
function StatCard({ icon, label, value, caption }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string | number; caption: string }) {
  return <View style={styles.statCard}><View style={styles.statIcon}><Ionicons name={icon} size={19} color={theme.colors.forest} /></View><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text><Text style={styles.statCaption}>{caption}</Text></View>;
}
function BarRow({ label, count, max, color = theme.colors.forest }: { label: string; count: number; max: number; color?: string }) {
  return <View style={styles.barRow}><View style={styles.barLabelRow}><Text style={styles.barLabel} numberOfLines={1}>{label}</Text><Text style={styles.barCount}>{count}</Text></View><View style={styles.barTrack}><View style={[styles.barFill, { width: `${max ? Math.max(count / max * 100, count ? 3 : 0) : 0}%`, backgroundColor: color }]} /></View></View>;
}
export default function StatisticsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>('all');
  useFocusEffect(useCallback(() => { let active = true; setLoading(true); setLoadError(null); listReports().then(items => { if (active) setReports(items); }).catch((error: unknown) => { if (active) { const message = error instanceof Error ? error.message : 'Les données locales ne peuvent pas être lues.'; setLoadError(message); Alert.alert('Statistiques indisponibles', message); } }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []));
  const filtered = useMemo(() => {
    if (period === 'all') return reports;
    const cutoff = Date.now() - Number(period) * 24 * 60 * 60 * 1000;
    return reports.filter(r => { const time = new Date(r.createdAt).getTime(); return Number.isFinite(time) && time >= cutoff; });
  }, [reports, period]);
  const byCategory = useMemo(() => REPORT_CATEGORIES.map(cat => ({ label: cat.label, count: filtered.filter(r => r.categoryId === cat.id).length })).filter(x => x.count > 0).sort((a,b) => b.count-a.count), [filtered]);
  const byRegion = useMemo(() => Array.from(filtered.reduce((map, r) => map.set(r.region || 'Non précisée', (map.get(r.region || 'Non précisée') || 0) + 1), new Map<string, number>()).entries()).map(([label,count]) => ({label,count})).sort((a,b) => b.count-a.count).slice(0,6), [filtered]);
  const byStatus = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(r => map.set(statusLabel(r.status), (map.get(statusLabel(r.status)) || 0) + 1));
    return Array.from(map.entries()).map(([label,count]) => ({label,count})).sort((a,b) => b.count-a.count);
  }, [filtered]);
  const last7 = useMemo(() => Array.from({length:7}, (_, i) => {
    const date = new Date(); date.setHours(0,0,0,0); date.setDate(date.getDate() - (6-i));
    const next = new Date(date); next.setDate(next.getDate()+1);
    return { label: date.toLocaleDateString('fr-FR', {weekday:'short'}).replace('.', ''), count: filtered.filter(r => { const d = new Date(r.createdAt); return d >= date && d < next; }).length };
  }), [filtered]);
  const maxDaily = Math.max(1, ...last7.map(x=>x.count));
  const maxCategory = Math.max(1, ...byCategory.map(x=>x.count));
  const maxRegion = Math.max(1, ...byRegion.map(x=>x.count));
  const maxStatus = Math.max(1, ...byStatus.map(x=>x.count));
  const recentCount = reports.filter(r => Date.now() - new Date(r.createdAt).getTime() <= 7*24*60*60*1000).length;
  return <ScrollView contentContainerStyle={styles.page}>
    <View style={styles.hero}><View style={styles.heroTop}><View style={styles.heroIcon}><Ionicons name="stats-chart" size={24} color={theme.colors.forest} /></View><Text style={styles.eyebrow}>TABLEAU DE BORD</Text></View><Text style={styles.title}>Les signalements en chiffres</Text><Text style={styles.subtitle}>Comprendre les situations enregistrées pour mieux agir.</Text><View style={styles.periods}>{PERIODS.map(item=><Pressable key={item.id} accessibilityRole="button" accessibilityState={{selected:period===item.id}} onPress={()=>setPeriod(item.id)} style={[styles.period,period===item.id&&styles.periodSelected]}><Text style={[styles.periodText,period===item.id&&styles.periodTextSelected]}>{item.label}</Text></Pressable>)}</View></View>
    <View style={styles.notice}><Ionicons name="phone-portrait-outline" size={18} color="#715314"/><Text style={styles.noticeText}>Ces chiffres proviennent uniquement des signalements enregistrés sur cet appareil. Ils ne représentent pas les signalements de tous les utilisateurs et ne sont pas transmis à SES.</Text></View>
    {loading ? <Text accessibilityRole="progressbar" style={styles.empty}>Chargement des statistiques…</Text> : loadError ? <View style={styles.errorCard}><Ionicons name="shield-checkmark-outline" size={30} color={theme.colors.danger}/><Text style={styles.errorTitle}>Statistiques indisponibles</Text><Text style={styles.empty}>Les données locales n’ont pas pu être lues. Les valeurs ne seront pas présentées comme des zéros, car cela pourrait laisser croire qu’aucun signalement n’existe.</Text><Text style={styles.errorDetails}>{loadError}</Text><Text style={styles.empty}>Ne désinstallez pas l’application et conservez la copie de récupération pour diagnostic.</Text></View> : <>
      <View style={styles.grid}><StatCard icon="documents-outline" label="Signalements" value={filtered.length} caption={period==='all'?'Total local':'Sur la période'}/><StatCard icon="calendar-outline" label="7 derniers jours" value={recentCount} caption="Enregistrements locaux"/></View>
      <View style={styles.panel}><Text style={styles.panelTitle}>Activité des 7 derniers jours</Text><Text style={styles.panelHint}>Nombre de signalements par jour</Text><View style={styles.dailyChart}>{last7.map((day,i)=><View key={day.label+i} style={styles.dayColumn}><Text style={styles.dayCount}>{day.count || ''}</Text><View style={styles.dayBarTrack}><View style={[styles.dayBar,{height:day.count?Math.max(6,day.count/maxDaily*92):3,backgroundColor:day.count?theme.colors.leaf:theme.colors.border}]}/></View><Text style={styles.dayLabel}>{day.label}</Text></View>)}</View></View>
      <View style={styles.panel}><Text style={styles.panelTitle}>Par catégorie</Text><Text style={styles.panelHint}>Thématiques les plus signalées</Text>{byCategory.length ? byCategory.map(item=><BarRow key={item.label} label={item.label} count={item.count} max={maxCategory}/>) : <Text style={styles.emptyInline}>Aucune donnée pour cette période.</Text>}</View>
      <View style={styles.panel}><Text style={styles.panelTitle}>Répartition par région</Text><Text style={styles.panelHint}>Les 6 régions les plus représentées</Text>{byRegion.length ? byRegion.map(item=><BarRow key={item.label} label={item.label} count={item.count} max={maxRegion} color={theme.colors.blue}/>) : <Text style={styles.emptyInline}>Aucune donnée pour cette période.</Text>}</View>
      <View style={styles.panel}><Text style={styles.panelTitle}>Statut des dossiers</Text>{byStatus.length ? byStatus.map(item=><BarRow key={item.label} label={item.label} count={item.count} max={maxStatus} color={theme.colors.gold}/>) : <Text style={styles.emptyInline}>Aucune donnée pour cette période.</Text>}</View>
      <View style={styles.footerCard}><Ionicons name="information-circle-outline" size={20} color={theme.colors.forest}/><Text style={styles.footerText}>Pour des statistiques nationales consolidées, il faudra connecter l'application à une API sécurisée et agréger uniquement les signalements transmis avec le consentement requis.</Text></View>
    </>}
  </ScrollView>;
}
const styles = StyleSheet.create({
 page:{padding:18,paddingBottom:36,gap:14},errorCard:{backgroundColor:theme.colors.white,borderWidth:1,borderColor:theme.colors.border,borderRadius:18,padding:22,alignItems:'center',gap:12},errorTitle:{color:theme.colors.ink,fontSize:16,fontWeight:'900'},errorDetails:{color:theme.colors.danger,fontSize:12,lineHeight:18,textAlign:'left',alignSelf:'stretch'},hero:{backgroundColor:theme.colors.forest,borderRadius:25,padding:20,gap:10},heroTop:{flexDirection:'row',alignItems:'center',gap:10},heroIcon:{width:46,height:46,borderRadius:15,backgroundColor:theme.colors.white,alignItems:'center',justifyContent:'center'},eyebrow:{color:'#BDE7CD',fontSize:11,fontWeight:'900',letterSpacing:1.8},title:{color:theme.colors.white,fontSize:25,lineHeight:31,fontWeight:'900'},subtitle:{color:'#E0F2E7',fontSize:13,lineHeight:19},periods:{flexDirection:'row',gap:7,marginTop:5},period:{paddingVertical:9,paddingHorizontal:14,borderRadius:999,borderWidth:1,borderColor:'#6AA58A'},periodSelected:{backgroundColor:theme.colors.gold,borderColor:theme.colors.gold},periodText:{color:theme.colors.white,fontSize:12,fontWeight:'700'},periodTextSelected:{color:theme.colors.ink},notice:{backgroundColor:'#FFF6DF',borderRadius:14,padding:13,flexDirection:'row',alignItems:'flex-start',gap:9},noticeText:{flex:1,color:'#715F36',fontSize:11,lineHeight:17},grid:{flexDirection:'row',gap:10},statCard:{flex:1,backgroundColor:theme.colors.white,borderWidth:1,borderColor:theme.colors.border,borderRadius:17,padding:14,gap:5},statIcon:{width:36,height:36,borderRadius:12,backgroundColor:theme.colors.mint,alignItems:'center',justifyContent:'center'},statValue:{color:theme.colors.ink,fontSize:27,fontWeight:'900',marginTop:4},statLabel:{color:theme.colors.ink,fontWeight:'800',fontSize:13},statCaption:{color:theme.colors.muted,fontSize:10,lineHeight:14},panel:{backgroundColor:theme.colors.white,borderWidth:1,borderColor:theme.colors.border,borderRadius:18,padding:16,gap:13},panelTitle:{color:theme.colors.ink,fontSize:16,fontWeight:'900'},panelHint:{color:theme.colors.muted,fontSize:11,marginTop:-9},dailyChart:{height:137,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around',gap:8,paddingTop:6},dayColumn:{flex:1,alignItems:'center',justifyContent:'flex-end',gap:6,height:'100%'},dayCount:{fontSize:10,color:theme.colors.ink,fontWeight:'800',height:12},dayBarTrack:{height:92,justifyContent:'flex-end',width:'72%',alignItems:'center'},dayBar:{width:'100%',borderRadius:6},dayLabel:{fontSize:10,color:theme.colors.muted,textTransform:'capitalize'},barRow:{gap:6},barLabelRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8},barLabel:{flex:1,color:theme.colors.ink,fontSize:12,fontWeight:'600'},barCount:{color:theme.colors.ink,fontSize:12,fontWeight:'900'},barTrack:{height:8,backgroundColor:theme.colors.paper,borderRadius:999,overflow:'hidden'},barFill:{height:'100%',borderRadius:999},empty:{color:theme.colors.muted,textAlign:'center',padding:22},emptyInline:{color:theme.colors.muted,fontSize:12},footerCard:{backgroundColor:theme.colors.mint,borderRadius:15,padding:14,flexDirection:'row',gap:9,alignItems:'flex-start'},footerText:{flex:1,color:theme.colors.forest,fontSize:11,lineHeight:17}
});
