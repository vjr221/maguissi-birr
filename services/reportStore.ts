import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Report } from '@/types/report';
import { isValidReport } from '@/utils/reportValidation';

const KEY = 'maguissi-birr:reports:v1';
const RECOVERY_KEY = 'maguissi-birr:reports:recovery-backup:v1';

async function preserveRawData(raw: string): Promise<void> {
  // Never replace the only copy of malformed data. Keep the first recovery
  // snapshot intact so repeated reads cannot overwrite it.
  const existingBackup = await AsyncStorage.getItem(RECOVERY_KEY);
  if (existingBackup === null) {
    await AsyncStorage.setItem(RECOVERY_KEY, raw);
  }
}

export async function listReports(): Promise<Report[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    await preserveRawData(raw);
    throw new Error('Les données locales semblent endommagées. Une copie de secours a été conservée ; aucun signalement n’a été effacé.');
  }

  if (!Array.isArray(parsed) || !parsed.every(isValidReport)) {
    await preserveRawData(raw);
    throw new Error('Certains signalements locaux sont illisibles. Une copie de secours a été conservée ; aucun enregistrement ne sera remplacé automatiquement.');
  }

  return parsed.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function saveReport(report: Report): Promise<void> {
  if (!isValidReport(report)) throw new Error('Invalid report data');
  // listReports throws if existing data is malformed, preventing a new save
  // from silently replacing and losing the previous local records.
  const current = await listReports();
  await AsyncStorage.setItem(KEY, JSON.stringify([report, ...current.filter((item) => item.id !== report.id)]));
}

import { mergeReportBackup, parseReportBackup } from '@/utils/reportBackup';

/** Import a validated backup additively. Existing local reports are never overwritten. */
export async function restoreReportsFromBackup(raw: string): Promise<{ added: number; skipped: number }> {
  const imported = parseReportBackup(raw);
  // listReports throws on damaged storage, preserving its recovery snapshot instead of overwriting it.
  const current = await listReports();
  const merged = mergeReportBackup(current, imported);
  if (merged.added > 0) {
    await AsyncStorage.setItem(KEY, JSON.stringify(merged.reports));
  }
  return { added: merged.added, skipped: merged.skipped };
}
