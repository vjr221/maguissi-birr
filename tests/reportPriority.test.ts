import { isPriorityReport } from '@/utils/reportPriority';

describe('isPriorityReport', () => {
  it('marks only an explicitly confirmed immediate danger as priority', () => {
    expect(isPriorityReport({ dangerImmediate: true })).toBe(true);
    expect(isPriorityReport({ dangerImmediate: false })).toBe(false);
    expect(isPriorityReport({})).toBe(false);
  });

  it('does not infer priority from words in the description', () => {
    const report = { dangerImmediate: false, description: 'Il n’y a pas de danger immédiat.' };
    expect(isPriorityReport(report)).toBe(false);
  });
});
