export type ReportStatus = 'RECEIVED' | 'QUALIFICATION' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED' | 'DUPLICATE' | 'NEEDS_INFO';

export type ReportEvent = { status: ReportStatus; at: string; note?: string };

export type Report = {
  id: string;
  reference: string;
  categoryId: string;
  description: string;
  /** Optional for backwards compatibility with reports saved by older app versions. */
  dangerImmediate?: boolean;
  region: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  photoUris: string[];
  createdAt: string;
  status: ReportStatus;
  events: ReportEvent[];
};
