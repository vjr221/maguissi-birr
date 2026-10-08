import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Report } from '@/types/report';

const KEY = 'maguissi-birr:reports:v1';

export async function listReports(): Promise<Report[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as Report[] : [];
  } catch {
    return [];
  }
}

export async function saveReport(report: Report): Promise<void> {
  const current = await listReports();
  await AsyncStorage.setItem(KEY, JSON.stringify([report, ...current.filter((item) => item.id !== report.id)]));
}
