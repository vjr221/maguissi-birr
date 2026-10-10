import type { Report } from '@/types/report';
import { createReportBackup, mergeReportBackup, parseReportBackup, MAX_BACKUP_CHARACTERS, MAX_BACKUP_REPORTS } from '@/utils/reportBackup';

const report: Report = {
  id: 'report-a',
  reference: 'MB-2026-000001',
  categoryId: 'environment',
  description: 'Déchets abandonnés près du marché.',
  region: 'Dakar',
  latitude: 14.7,
  longitude: -17.4,
  photoUris: ['file:///private/photo.jpg'],
  createdAt: '2026-10-08T12:00:00.000Z',
  status: 'RECEIVED',
  events: [{ status: 'RECEIVED', at: '2026-10-08T12:00:00.000Z' }]
};

describe('report backup', () => {
  it('exports valid JSON while excluding device-specific photo paths', () => {
    const parsed = JSON.parse(createReportBackup([report], '2026-10-10T10:00:00.000Z'));
    expect(parsed.app).toBe('MAGUISSI BIRR');
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.reports[0].photoUris).toEqual([]);
    expect(parsed.reports[0].latitude).toBe(14.7);
  });

  it('validates the complete backup before returning records and drops imported photo paths', () => {
    const raw = createReportBackup([report]);
    expect(parseReportBackup(raw)[0].photoUris).toEqual([]);
    expect(() => parseReportBackup('{broken')).toThrow('JSON valide');
    expect(() => parseReportBackup(JSON.stringify({ app: 'Other', schemaVersion: 1, exportedAt: '2026-10-10T00:00:00.000Z', reports: [] }))).toThrow('compatible');
    expect(() => parseReportBackup(JSON.stringify({ app: 'MAGUISSI BIRR', schemaVersion: 1, exportedAt: 'not-a-date', reports: [] }))).toThrow('compatible');
    expect(() => createReportBackup([report], 'not-a-date')).toThrow('date');
    expect(() => parseReportBackup(JSON.stringify({ app: 'MAGUISSI BIRR', schemaVersion: 1, exportedAt: '2026-10-10T00:00:00.000Z', reports: [{ ...report, region: 'unknown' }] }))).toThrow('invalides');
  });

  it('rejects oversized backup files and excessive report counts before processing records', () => {
    expect(() => parseReportBackup(' '.repeat(MAX_BACKUP_CHARACTERS + 1))).toThrow('trop volumineux');
    const base = { app: 'MAGUISSI BIRR', schemaVersion: 1, exportedAt: '2026-10-10T00:00:00.000Z' };
    const tooMany = Array.from({ length: MAX_BACKUP_REPORTS + 1 }, (_, index) => ({ ...report, id: 'report-' + index, reference: 'MB-2026-' + String(index).padStart(6, '0') }));
    expect(() => parseReportBackup(JSON.stringify({ ...base, reports: tooMany }))).toThrow('5 000');
    expect(() => createReportBackup(tooMany)).toThrow('nombre maximal');
  });

  it('rejects duplicate ids or references in exported and imported backup documents', () => {
    const sameId = { ...report, reference: 'MB-2026-000002' };
    const sameReference = { ...report, id: 'report-b' };
    expect(() => createReportBackup([report, sameId])).toThrow('en double');
    expect(() => createReportBackup([report, sameReference])).toThrow('en double');

    const base = { app: 'MAGUISSI BIRR', schemaVersion: 1, exportedAt: '2026-10-10T00:00:00.000Z' };
    expect(() => parseReportBackup(JSON.stringify({ ...base, reports: [report, sameId] }))).toThrow('en double');
    expect(() => parseReportBackup(JSON.stringify({ ...base, reports: [report, sameReference] }))).toThrow('en double');
  });

  it('merges without overwriting existing records and ignores duplicate ids or references', () => {
    const existing = { ...report, description: 'Description locale à conserver.' };
    const duplicateId = { ...report, description: 'Description de la sauvegarde.' };
    const duplicateReference = { ...report, id: 'report-b' };
    const newReport = { ...report, id: 'report-c', reference: 'MB-2026-000003', createdAt: '2026-10-09T12:00:00.000Z' };
    const result = mergeReportBackup([existing], [duplicateId, duplicateReference, newReport]);
    expect(result.added).toBe(1);
    expect(result.skipped).toBe(2);
    expect(result.reports[0].id).toBe('report-c');
    expect(result.reports.find((item) => item.id === 'report-a')?.description).toBe('Description locale à conserver.');
  });
});
