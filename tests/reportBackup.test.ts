import type { Report } from '@/types/report';
import { createReportBackup, mergeReportBackup, parseReportBackup } from '@/utils/reportBackup';

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
    expect(() => parseReportBackup(JSON.stringify({ app: 'Other', schemaVersion: 1, reports: [] }))).toThrow('compatible');
    expect(() => parseReportBackup(JSON.stringify({ app: 'MAGUISSI BIRR', schemaVersion: 1, reports: [{ ...report, region: 'unknown' }] }))).toThrow('invalides');
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
