import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Report } from '@/types/report';
import { isValidReport } from '@/utils/reportValidation';

const KEY = 'maguissi-birr:reports:v1';

export async function listReports(): Promise<Report[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidReport).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  } catch {
    return [];
  }
}

export async function saveReport(report: Report): Promise<void> {
  if (!isValidReport(report)) throw new Error('Invalid report data');
  const current = await listReports();
  await AsyncStorage.setItem(KEY, JSON.stringify([report, ...current.filter((item) => item.id !== report.id)]));
}
