import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveReport } from '@/services/reportStore';
import type { Report } from '@/types/report';

jest.mock('@react-native-async-storage/async-storage', () => ({ __esModule: true, default: { getItem: jest.fn(), setItem: jest.fn() } }));
const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const saved: Report = { id: 'same-id', reference: 'MB-2026-OLD', categoryId: 'environment', description: 'Déchets abandonnés près du marché.', region: 'Dakar', photoUris: [], createdAt: '2026-10-08T12:00:00.000Z', status: 'RECEIVED', events: [{ status: 'RECEIVED', at: '2026-10-08T12:00:00.000Z' }] };

describe('saveReport identity conflicts', () => {
  beforeEach(() => { jest.clearAllMocks(); storage.getItem.mockImplementation(async (key) => key === 'maguissi-birr:reports:v1' ? JSON.stringify([saved]) : null); storage.setItem.mockResolvedValue(); });
  it('does not replace a different report when an ID is reused', async () => {
    const candidate = { ...saved, reference: 'MB-2026-NEW', description: 'Un autre signalement valide.' };
    await expect(saveReport(candidate)).rejects.toThrow('identifiant est déjà associé');
    expect(storage.setItem).not.toHaveBeenCalled();
  });
});
