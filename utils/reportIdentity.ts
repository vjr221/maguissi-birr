import type { Report } from '@/types/report';

export type ReportIdentity = Pick<Report, 'id' | 'reference'>;

function randomSuffix(random: () => number): string {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new Error('Impossible de générer une référence locale sûre.');
  }
  // Pad very small values so test doubles and unusual random values still
  // produce a non-empty suffix; Math.random normally provides more entropy.
  return value.toString(36).slice(2, 12).toUpperCase().padEnd(10, '0');
}

/**
 * Build a local ID/reference pair that does not collide with known reports.
 * This is a collision guard, not a cryptographic identifier or server ticket.
 */
export function createUniqueReportIdentity(
  existing: Pick<Report, 'id' | 'reference'>[],
  now = Date.now(),
  random: () => number = Math.random,
  maxAttempts = 10
): ReportIdentity {
  const ids = new Set(existing.map((report) => report.id));
  const references = new Set(existing.map((report) => report.reference));
  const year = new Date(now).getFullYear();

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const id = `${now}-${randomSuffix(random).toLowerCase()}`;
    const reference = `MB-${year}-${randomSuffix(random)}`;
    if (!ids.has(id) && !references.has(reference)) return { id, reference };
  }

  throw new Error('Une référence locale unique n’a pas pu être générée. Réessayez sans fermer l’application.');
}
