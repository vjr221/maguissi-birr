import type { Report } from '@/types/report';
import { isValidReport } from '@/utils/reportValidation';

export const REPORT_BACKUP_APP = 'MAGUISSI BIRR';
export const REPORT_BACKUP_VERSION = 1;

export type ReportBackup = {
  app: typeof REPORT_BACKUP_APP;
  schemaVersion: typeof REPORT_BACKUP_VERSION;
  exportedAt: string;
  reports: Report[];
};

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

/** Photos are intentionally excluded: local file URIs cannot be restored on another device. */
export function createReportBackup(reports: Report[], exportedAt = new Date().toISOString()): string {
  if (!Number.isFinite(Date.parse(exportedAt))) throw new Error('La date de création de la sauvegarde est invalide.');
  if (!reports.every(isValidReport)) throw new Error('Impossible de sauvegarder des signalements invalides.');
  if (!hasUniqueIdentities(reports)) throw new Error('Impossible de sauvegarder des signalements avec des identifiants ou références en double.');
  const document: ReportBackup = {
    app: REPORT_BACKUP_APP,
    schemaVersion: REPORT_BACKUP_VERSION,
    exportedAt,
    reports: reports.map((report) => ({ ...report, photoUris: [] }))
  };
  return JSON.stringify(document, null, 2);
}

/** Validate the whole document before any stored data can be changed. */
export function parseReportBackup(raw: string): Report[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Le fichier sélectionné ne contient pas un JSON valide.');
  }
  if (!parsed || typeof parsed !== 'object') throw new Error('Le fichier de sauvegarde est invalide.');
  const document = parsed as Partial<ReportBackup>;
  if (document.app !== REPORT_BACKUP_APP || document.schemaVersion !== REPORT_BACKUP_VERSION || !Array.isArray(document.reports) || typeof document.exportedAt !== 'string' || !Number.isFinite(Date.parse(document.exportedAt))) {
    throw new Error('Ce fichier n’est pas une sauvegarde MAGUISSI BIRR compatible.');
  }
  const reports = document.reports.map((item) => {
    if (!item || typeof item !== 'object') return item;
    // Photo URIs are device-specific paths; never import them from another installation.
    return { ...item, photoUris: [] };
  });
  if (!reports.every(isValidReport)) {
    throw new Error('La sauvegarde contient des signalements invalides. Aucune donnée n’a été modifiée.');
  }
  if (!hasUniqueIdentities(reports)) {
    throw new Error('La sauvegarde contient des identifiants ou références en double. Aucune donnée n’a été modifiée.');
  }
  return reports;
}

/** Existing on-device records win; restore is additive and never overwrites local records. */
export function mergeReportBackup(existing: Report[], imported: Report[]): { reports: Report[]; added: number; skipped: number } {
  const ids = new Set(existing.map((report) => report.id));
  const references = new Set(existing.map((report) => report.reference));
  const additions: Report[] = [];
  let skipped = 0;
  for (const report of imported) {
    if (ids.has(report.id) || references.has(report.reference)) {
      skipped += 1;
      continue;
    }
    ids.add(report.id);
    references.add(report.reference);
    additions.push(report);
  }
  return { reports: [...existing, ...additions].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)), added: additions.length, skipped };
}
