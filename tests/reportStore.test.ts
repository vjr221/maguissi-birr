import AsyncStorage from '@react-native-async-storage/async-storage';
import { listReports, saveReport } from '@/services/reportStore';
import type { Report } from '@/types/report';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn()
  }
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
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

describe('reportStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getItem.mockResolvedValue(null);
    storage.setItem.mockResolvedValue();
  });

  it('returns an empty list when there is no stored data', async () => {
    await expect(listReports()).resolves.toEqual([]);
  });

  it('sorts valid reports newest first', async () => {
    const older = { ...validReport, id: 'older', createdAt: '2026-10-01T12:00:00.000Z' };
    storage.getItem.mockResolvedValueOnce(JSON.stringify([older, validReport]));
    await expect(listReports()).resolves.toEqual([validReport, older]);
  });

  it('backs up malformed JSON and refuses to pretend the list is empty', async () => {
    storage.getItem.mockImplementation(async (key) => key === 'maguissi-birr:reports:v1' ? '{broken' : null);
    await expect(listReports()).rejects.toThrow('copie de secours');
    expect(storage.setItem).toHaveBeenCalledWith('maguissi-birr:reports:recovery-backup:v1', '{broken');
  });

  it('does not overwrite the original data when a save finds invalid records', async () => {
    storage.getItem.mockImplementation(async (key) => key === 'maguissi-birr:reports:v1' ? JSON.stringify([{ invalid: true }]) : null);
    await expect(saveReport(validReport)).rejects.toThrow('copie de secours');
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('maguissi-birr:reports:recovery-backup:v1', JSON.stringify([{ invalid: true }]));
  });

  it('stores a valid report alongside existing records', async () => {
    storage.getItem.mockResolvedValueOnce(JSON.stringify([validReport]));
    await saveReport({ ...validReport, id: 'test-2', reference: 'MB-2026-000002' });
    expect(storage.setItem).toHaveBeenCalledWith(
      'maguissi-birr:reports:v1',
      JSON.stringify([{ ...validReport, id: 'test-2', reference: 'MB-2026-000002' }, validReport])
    );
  });
});
