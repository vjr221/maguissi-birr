import { REPORT_CATEGORIES, REGIONS } from '@/constants/categories';
import type { Report, ReportStatus } from '@/types/report';

export function validateDescription(value: string): string | null {
  const normalized = value.trim();
  if (normalized.length < 12) return 'Décrivez la situation en au moins 12 caractères.';
  if (normalized.length > 2000) return 'La description ne peut pas dépasser 2 000 caractères.';
  return null;
}

export function isValidReport(value: unknown): value is Report {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<Report>;
  const statuses: ReportStatus[] = ['RECEIVED', 'QUALIFICATION', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED', 'DUPLICATE', 'NEEDS_INFO'];
  const hasLatitude = typeof item.latitude === 'number';
  const hasLongitude = typeof item.longitude === 'number';
  const validCoordinates = hasLatitude === hasLongitude
    && (!hasLatitude || (
      Number.isFinite(item.latitude) && item.latitude! >= -90 && item.latitude! <= 90
      && Number.isFinite(item.longitude) && item.longitude! >= -180 && item.longitude! <= 180
    ));
  return typeof item.id === 'string' && item.id.trim().length > 0
    && typeof item.reference === 'string' && item.reference.trim().length > 0
    && typeof item.categoryId === 'string'
    && REPORT_CATEGORIES.some((category) => category.id === item.categoryId)
    && typeof item.description === 'string'
    && (item.dangerImmediate === undefined || typeof item.dangerImmediate === 'boolean')
    && item.description.trim().length >= 12
    && item.description.length <= 2000
    && typeof item.region === 'string'
    && REGIONS.includes(item.region)
    && (item.locality === undefined || typeof item.locality === 'string')
    && Array.isArray(item.photoUris)
    && item.photoUris.length <= 3
    && item.photoUris.every((uri) => typeof uri === 'string')
    && validCoordinates
    && typeof item.createdAt === 'string'
    && !Number.isNaN(Date.parse(item.createdAt))
    && typeof item.status === 'string'
    && statuses.includes(item.status as ReportStatus)
    && Array.isArray(item.events)
    && item.events.every((event) => !!event
      && typeof event === 'object'
      && typeof event.status === 'string'
      && statuses.includes(event.status as ReportStatus)
      && typeof event.at === 'string'
      && !Number.isNaN(Date.parse(event.at))
      && (event.note === undefined || typeof event.note === 'string'));
}

export function statusLabel(status: ReportStatus): string {
  const labels: Record<ReportStatus, string> = {
    RECEIVED: 'Enregistré sur cet appareil',
    QUALIFICATION: 'À qualifier',
    ASSIGNED: 'Affecté',
    IN_PROGRESS: 'En cours',
    RESOLVED: 'Résolu',
    CLOSED: 'Clôturé',
    REJECTED: 'Rejeté',
    DUPLICATE: 'Doublon',
    NEEDS_INFO: 'Informations nécessaires'
  };
  return labels[status];
}
