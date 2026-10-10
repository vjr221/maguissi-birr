import AsyncStorage from '@react-native-async-storage/async-storage';
import { listReports, restoreReportsFromBackup, saveReport } from '@/services/reportStore';
import { createReportBackup } from '@/utils/reportBackup';
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
    const older = { ...validReport, id: 'older', reference: 'MB-2026-000002', createdAt: '2026-10-01T12:00:00.000Z' };
    storage.getItem.mockResolvedValueOnce(JSON.stringify([older, validReport]));
    await expect(listReports()).resolves.toEqual([validReport, older]);
  });

  it('backs up malformed JSON and refuses to pretend the list is empty', async () => {
    storage.getItem.mockImplementation(async (key) => key === 'maguissi-birr:reports:v1' ? '{broken' : null);
    await expect(listReports()).rejects.toThrow('copie de secours');
    expect(storage.setItem).toHaveBeenCalledWith('maguissi-birr:reports:recovery-backup:v1', '{broken');
  });

  it('does not overwrite the original data when a save finds invalid records', async () => {
    const invalid = JSON.stringify([{ invalid: true }]);
    storage.getItem.mockImplementation(async (key) => key === 'maguissi-birr:reports:v1' ? invalid : null);
    await expect(saveReport(validReport)).rejects.toThrow('copie de secours');
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('maguissi-birr:reports:recovery-backup:v1', invalid);
  });

  it('backs up locally stored duplicate identities and refuses to read them as normal records', async () => {
    const duplicate = { ...validReport, id: 'test-2' };
    const raw = JSON.stringify([validReport, duplicate]);
    storage.getItem.mockImplementation(async (key) => key === 'maguissi-birr:reports:v1' ? raw : null);
    await expect(listReports()).rejects.toThrow('en double');
    expect(storage.setItem).toHaveBeenCalledWith('maguissi-birr:reports:recovery-backup:v1', raw);
  });

  it('refuses to save a new report using another report’s reference', async () => {
    storage.getItem.mockImplementation(async (key) => key === 'maguissi-birr:reports:v1' ? JSON.stringify([validReport]) : null);
    const conflicting = { ...validReport, id: 'test-2' };
    await expect(saveReport(conflicting)).rejects.toThrow('déjà associée');
    expect(storage.setItem).not.toHaveBeenCalledWith('maguissi-birr:reports:v1', expect.any(String));
  });

  it('restores new reports additively without overwriting existing records', async () => {
    const existing = { ...validReport, description: 'Description locale à conserver.' };
    const imported = { ...validReport, id: 'test-2', reference: 'MB-2026-000002', createdAt: '2026-10-09T12:00:00.000Z' };
    storage.getItem.mockImplementation(async (key) => key === 'maguissi-birr:reports:v1' ? JSON.stringify([existing]) : null);

    await expect(restoreReportsFromBackup(createReportBackup([validReport, imported]))).resolves.toEqual({ added: 1, skipped: 1 });

    expect(storage.setItem).toHaveBeenCalledWith(
      'maguissi-birr:reports:v1',
      JSON.stringify([imported, existing])
    );
    expect(storage.setItem).not.toHaveBeenCalledWith('maguissi-birr:reports:v1', expect.stringContaining('Description de sauvegarde'));
  });

  it('refuses to restore over damaged local records', async () => {
    storage.getItem.mockImplementation(async (key) => key === 'maguissi-birr:reports:v1' ? '{broken' : null);
    await expect(restoreReportsFromBackup(createReportBackup([validReport]))).rejects.toThrow('copie de secours');
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('maguissi-birr:reports:recovery-backup:v1', '{broken');
  });

  it('stores a valid report alongside existing records', async () => {
    storage.getItem.mockResolvedValueOnce(JSON.stringify([validReport]));
    const added = { ...validReport, id: 'test-2', reference: 'MB-2026-000002' };
    await saveReport(added);
    expect(storage.setItem).toHaveBeenCalledWith(
      'maguissi-birr:reports:v1',
      JSON.stringify([added, validReport])
    );
  });
});
