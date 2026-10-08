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
  return typeof item.id === 'string'
    && typeof item.reference === 'string'
    && typeof item.categoryId === 'string'
    && REPORT_CATEGORIES.some((category) => category.id === item.categoryId)
    && typeof item.description === 'string'
    && item.description.trim().length >= 12
    && typeof item.region === 'string'
    && REGIONS.includes(item.region)
    && Array.isArray(item.photoUris)
    && item.photoUris.every((uri) => typeof uri === 'string')
    && typeof item.createdAt === 'string'
    && !Number.isNaN(Date.parse(item.createdAt))
    && typeof item.status === 'string'
    && ['RECEIVED', 'QUALIFICATION', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED', 'DUPLICATE', 'NEEDS_INFO'].includes(item.status)
    && Array.isArray(item.events);
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
