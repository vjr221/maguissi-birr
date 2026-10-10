import type { Report } from '@/types/report';

/**
 * Priority is an explicit observation from the person reporting.
 * Description keywords are deliberately not used: phrases such as
 * "no immediate danger" must never trigger an automatic priority flag.
 * Missing values on legacy local reports are treated as not confirmed.
 */
export function isPriorityReport(report: Pick<Report, 'dangerImmediate'>): boolean {
  return report.dangerImmediate === true;
}
