import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/constants/theme';

export default function RootLayout() {
  return <>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerStyle: { backgroundColor: theme.colors.paper }, headerTintColor: theme.colors.ink, headerTitleStyle: { fontWeight: '700' }, contentStyle: { backgroundColor: theme.colors.paper } }}>
      <Stack.Screen name="index" options={{ title: 'MAGUISSI BIRR', headerShown: false }} />
      <Stack.Screen name="tips" options={{ title: 'Conseils pratiques' }} />
      <Stack.Screen name="reports" options={{ title: 'Mes signalements' }} />
      <Stack.Screen name="new-report" options={{ title: 'Nouveau signalement' }} />
    </Stack>
  </>;
}
