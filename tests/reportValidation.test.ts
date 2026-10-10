import { isValidReport, statusLabel, validateDescription } from '@/utils/reportValidation';
import type { Report } from '@/types/report';

const validReport: Report = {
  id: 'test-1',
  reference: 'MB-2026-000001',
  categoryId: 'environment',
  description: 'Déchets abandonnés près du marché.',
  region: 'Dakar',
  photoUris: [],
  createdAt: '2026-10-08T12:00:00.000Z',
  status: 'RECEIVED',
  events: [{ status: 'RECEIVED', at: '2026-10-08T12:00:00.000Z' }]
};

describe('validateDescription', () => {
  it('rejects descriptions that are too short', () => {
    expect(validateDescription('danger')).toContain('12 caractères');
  });
  it('accepts a sufficiently detailed description', () => {
    expect(validateDescription('Une description suffisamment détaillée')).toBeNull();
  });
  it('rejects descriptions above 2,000 characters', () => {
    expect(validateDescription('x'.repeat(2001))).toContain('2 000');
  });
});

describe('isValidReport', () => {
  it('accepts a valid report', () => {
    expect(isValidReport(validReport)).toBe(true);
  });
  it('rejects an unknown region or category', () => {
    expect(isValidReport({ ...validReport, region: 'Région inventée' })).toBe(false);
    expect(isValidReport({ ...validReport, categoryId: 'unknown' })).toBe(false);
  });
  it('rejects malformed values', () => {
    expect(isValidReport(null)).toBe(false);
    expect(isValidReport({ ...validReport, createdAt: 'not-a-date' })).toBe(false);
  });
  it('accepts legacy reports without the new flag but rejects malformed immediate-danger values', () => {
    expect(isValidReport(validReport)).toBe(true);
    expect(isValidReport({ ...validReport, dangerImmediate: true })).toBe(true);
    expect(isValidReport({ ...validReport, dangerImmediate: 'yes' })).toBe(false);
  });
  it('rejects unsafe coordinates, too many photos, and malformed event history', () => {
    expect(isValidReport({ ...validReport, latitude: 91, longitude: 2 })).toBe(false);
    expect(isValidReport({ ...validReport, latitude: 14 })).toBe(false);
    expect(isValidReport({ ...validReport, photoUris: ['1', '2', '3', '4'] })).toBe(false);
    expect(isValidReport({ ...validReport, events: [{ status: 'UNKNOWN', at: 'yesterday' }] })).toBe(false);
  });
});

it('maps internal statuses to French labels', () => {
  expect(statusLabel('RECEIVED')).toBe('Enregistré sur cet appareil');
  expect(statusLabel('IN_PROGRESS')).toBe('En cours');
});
