/**
 * Persist photos one at a time so any earlier copies can be cleaned up if a later
 * photo fails. Original picker URIs are never deleted.
 */
export async function persistReportPhotos(
  sourceUris: string[],
  persist: (uri: string) => Promise<string>,
  cleanup: (uri: string) => Promise<unknown>
): Promise<string[]> {
  const persistedUris: string[] = [];
  const createdUris: string[] = [];

  try {
    for (const sourceUri of sourceUris) {
      const persistentUri = await persist(sourceUri);
      persistedUris.push(persistentUri);
      if (persistentUri !== sourceUri) createdUris.push(persistentUri);
    }
    return persistedUris;
  } catch (error) {
    // Clean only copies created during this attempt. A selected URI that already
    // points to persistent app storage must not be removed.
    await Promise.all(createdUris.map(async (uri) => {
      try {
        await cleanup(uri);
      } catch {
        // Preserve the original persistence error; cleanup is best-effort.
      }
    }));
    throw error;
  }
}
