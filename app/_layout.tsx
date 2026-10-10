import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/constants/theme';

export default function RootLayout() {
  return <>
    <StatusBar style="dark" />
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.paper },
        headerTintColor: theme.colors.ink,
        headerTitleStyle: { fontWeight: '800' },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: theme.colors.paper },
        tabBarActiveTintColor: theme.colors.forest,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 66,
          paddingTop: 7,
          paddingBottom: 7,
          elevation: 12
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 1 },
        tabBarHideOnKeyboard: true
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          headerShown: false,
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size}
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Mes signalements',
          tabBarLabel: 'Signalements',
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" color={color} size={size}
        }}
      />
      <Tabs.Screen
        name="new-report"
        options={{
          title: 'Nouveau signalement',
          tabBarLabel: 'Signaler',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size}
        }}
      />
      <Tabs.Screen
        name="checklist"
        options={{
          title: 'Checklist prévention QHSE',
          tabBarLabel: 'Prévention',
          tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark-outline" color={color} size={size}
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contacter SES',
          tabBarLabel: 'Contact',
          tabBarIcon: ({ color, size }) => <Ionicons name="call-outline" color={color} size={size}
        }}
      />
      <Tabs.Screen name="tips" options={{ title: 'Conseils pratiques', href: null }} />
      <Tabs.Screen name="response-guide" options={{ title: 'Guide de réaction aux incidents', href: null }} />
      <Tabs.Screen name="statistics" options={{ title: 'Statistiques', href: null }} />
      <Tabs.Screen name="operations" options={{ title: 'Centre d’opérations QHSE', href: null }} />
    </Tabs>
  </>;
}
