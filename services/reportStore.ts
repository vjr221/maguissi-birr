import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Report } from '@/types/report';
import { isValidReport } from '@/utils/reportValidation';

const KEY = 'maguissi-birr:reports:v1';
const RECOVERY_KEY = 'maguissi-birr:reports:recovery-backup:v1';

type RecoveryResult = 'saved' | 'already-saved' | 'different-snapshot-kept';

async function preserveRawData(raw: string): Promise<RecoveryResult> {
  let existingBackup: string | null;
  try {
    existingBackup = await AsyncStorage.getItem(RECOVERY_KEY);
  } catch {
    throw new Error('Les données locales sont illisibles et la copie de secours ne peut pas être vérifiée. Les données d’origine n’ont pas été volontairement modifiées ; ne désinstallez pas l’application.');
  }

  if (existingBackup === raw) return 'already-saved';
  if (existingBackup !== null) return 'different-snapshot-kept';

  try {
    await AsyncStorage.setItem(RECOVERY_KEY, raw);
    return 'saved';
  } catch {
    throw new Error('Les données locales sont illisibles et la copie de secours n’a pas pu être enregistrée. Les données d’origine n’ont pas été volontairement modifiées ; ne désinstallez pas l’application.');
  }
}

function recoveryMessage(result: RecoveryResult): string {
  if (result === 'different-snapshot-kept') {
    return 'Une ancienne copie de secours existe et a été conservée, mais les données illisibles actuelles n’ont pas été copiées afin de ne pas écraser cette sauvegarde. Ne désinstallez pas l’application ; demandez un diagnostic avant toute restauration.';
  }
  return 'Une copie de secours des données illisibles a été conservée ; aucun signalement n’a été volontairement effacé.';
}

function hasUniqueIdentities(reports: Report[]): boolean {
  const ids = new Set<string>();
  const references = new Set<string>();
  for (const report of reports) {
    if (ids.has(report.id) || references.has(report.reference)) return false;
    ids.add(report.id);
    references.add(report.reference);
  }
  return true;
}

export async function listReports(): Promise<Report[]> {
  const raw = await AsyncStorage.getItem(KEY);
  // Only a missing key means an empty store. An empty string is stored data
  // that cannot be parsed, so preserve it as a recovery snapshot instead.
  if (raw === null) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const recovery = await preserveRawData(raw);
    throw new Error(`Les données locales semblent endommagées. ${recoveryMessage(recovery)}`);
  }

  if (!Array.isArray(parsed) || !parsed.every(isValidReport)) {
    const recovery = await preserveRawData(raw);
    throw new Error(`Certains signalements locaux sont illisibles. ${recoveryMessage(recovery)}`);
  }

  if (!hasUniqueIdentities(parsed)) {
    const recovery = await preserveRawData(raw);
    throw new Error(`Des identifiants ou références de signalements sont en double. ${recoveryMessage(recovery)}`);
  }

  return parsed.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function saveReport(report: Report): Promise<void> {
  if (!isValidReport(report)) throw new Error('Invalid report data');
  // listReports throws if existing data is malformed, preventing a new save
  // from silently replacing and losing the previous local records.
  const current = await listReports();
  const idOwner = current.find((item) => item.id === report.id && item.reference !== report.reference);
  if (idOwner) {
    throw new Error('Cet identifiant est déjà associé à un autre signalement. Aucun dossier n’a été modifié.');
  }
  const referenceOwner = current.find((item) => item.reference === report.reference && item.id !== report.id);
  if (referenceOwner) {
    throw new Error('Cette référence est déjà associée à un autre signalement. Aucun dossier n’a été modifié.');
  }
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
