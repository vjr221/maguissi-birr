import { createUniqueReportIdentity } from '@/utils/reportIdentity';

describe('createUniqueReportIdentity', () => {
  it('creates a year-scoped local reference', () => {
    const now = Date.parse('2026-10-10T12:00:00.000Z');
    const identity = createUniqueReportIdentity([], now, () => 0.123456789);
    expect(identity.id).toContain(String(now));
    expect(identity.reference).toMatch(/^MB-2026-[A-Z0-9]+$/);
  });

  it('retries when a generated identity collides', () => {
    const now = Date.parse('2026-10-10T12:00:00.000Z');
    const values = [0.1, 0.2, 0.3, 0.4];
    let index = 0;
    const identity = createUniqueReportIdentity([
      { id: now + '-' + (0.1).toString(36).slice(2, 12), reference: 'MB-2026-OTHER' }
    ], now, () => values[index++]);
    expect(identity.id).not.toBe(now + '-' + (0.1).toString(36).slice(2, 12));
  });

  it('fails safely after repeated collisions', () => {
    const now = Date.parse('2026-10-10T12:00:00.000Z');
    const suffix = (0.1).toString(36).slice(2, 12).toUpperCase().padEnd(10, '0');
    const existing = [{ id: now + '-' + suffix.toLowerCase(), reference: 'MB-2026-' + suffix }];
    expect(() => createUniqueReportIdentity(existing, now, () => 0.1, 2)).toThrow('unique');
  });

  it('rejects invalid random values', () => {
    expect(() => createUniqueReportIdentity([], Date.now(), () => 1)).toThrow('référence locale sûre');
  });
});
