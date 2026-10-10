import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Re-encode report photos as JPEG (dropping source metadata such as EXIF/GPS)
 * and move the result out of the temporary cache into persistent app storage.
 * The temporary re-encoded file is deleted after the persistent copy is made.
 */
export async function persistReportPhoto(uri: string): Promise<string> {
  const directory = FileSystem.documentDirectory;
  if (!directory) throw new Error('Le stockage permanent des photos est indisponible sur cet appareil.');
  if (uri.startsWith(directory)) return uri;

  const sanitized = await ImageManipulator.manipulateAsync(uri, [], {
    compress: 0.78,
    format: ImageManipulator.SaveFormat.JPEG
  });
  const destination = `${directory}maguissi-report-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.jpg`;

  try {
    await FileSystem.copyAsync({ from: sanitized.uri, to: destination });
    return destination;
  } catch (error) {
    // Avoid leaving a temporary image behind when the persistent copy fails.
    try {
      await FileSystem.deleteAsync(sanitized.uri, { idempotent: true });
    } catch {
      // Keep the original copy error as the useful failure.
    }
    throw error;
  } finally {
    // The returned destination lives in documentDirectory, not the cache.
    try {
      await FileSystem.deleteAsync(sanitized.uri, { idempotent: true });
    } catch {
      // Cache cleanup is best-effort and must not invalidate a saved report.
    }
  }
}
