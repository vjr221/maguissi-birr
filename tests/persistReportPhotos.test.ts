import { persistReportPhotos } from '@/utils/persistReportPhotos';

describe('persistReportPhotos', () => {
  it('cleans earlier copies if a later photo cannot be persisted', async () => {
    const persist = jest.fn()
      .mockResolvedValueOnce('file:///app/maguissi-report-1.jpg')
      .mockRejectedValueOnce(new Error('storage full'));
    const cleanup = jest.fn().mockResolvedValue(undefined);

    await expect(persistReportPhotos(
      ['content://picker/one', 'content://picker/two'],
      persist,
      cleanup
    )).rejects.toThrow('storage full');

    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(cleanup).toHaveBeenCalledWith('file:///app/maguissi-report-1.jpg');
  });

  it('never cleans up an original URI already in persistent storage', async () => {
    const original = 'file:///app/existing-report-photo.jpg';
    const persist = jest.fn()
      .mockResolvedValueOnce(original)
      .mockRejectedValueOnce(new Error('storage full'));
    const cleanup = jest.fn().mockResolvedValue(undefined);

    await expect(persistReportPhotos(
      [original, 'content://picker/two'],
      persist,
      cleanup
    )).rejects.toThrow('storage full');

    expect(cleanup).not.toHaveBeenCalled();
  });

  it('returns all persisted URIs on success', async () => {
    const persist = jest.fn()
      .mockResolvedValueOnce('file:///app/photo-1.jpg')
      .mockResolvedValueOnce('file:///app/photo-2.jpg');
    const cleanup = jest.fn().mockResolvedValue(undefined);

    await expect(persistReportPhotos(['picker:one', 'picker:two'], persist, cleanup))
      .resolves.toEqual(['file:///app/photo-1.jpg', 'file:///app/photo-2.jpg']);
    expect(cleanup).not.toHaveBeenCalled();
  });
});
