import * as FileSystem from 'expo-file-system/legacy';

/**
 * Move a selected/captured image out of the temporary cache before storing
 * its URI in a report. This preserves local attachments across cache cleanup.
 * Image privacy processing (EXIF removal/recompression) is handled separately.
 */
export async function persistReportPhoto(uri: string): Promise<string> {
  if (uri.startsWith(FileSystem.documentDirectory ?? '\u0000')) return uri;
  const directory = FileSystem.documentDirectory;
  if (!directory) throw new Error('Le stockage permanent des photos est indisponible sur cet appareil.');

  const extensionMatch = uri.split('?')[0].match(/\.([a-zA-Z0-9]{2,5})$/);
  const extension = extensionMatch?.[1]?.toLowerCase() ?? 'jpg';
  const safeExtension = ['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(extension) ? extension : 'jpg';
  const destination = `${directory}maguissi-report-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExtension}`;
  await FileSystem.copyAsync({ from: uri, to: destination });
  return destination;
}
