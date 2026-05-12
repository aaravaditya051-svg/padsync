import { useMemo, useEffect } from 'react';
import { createTLStore, defaultShapeUtils } from 'tldraw';
import { socket } from '../services/socket';
import { SOCKET_EVENTS } from 'shared/events';

// responsibility: synchronizes tldraw store over socket.io using document changes
export function useSyncStore(roomId: string | null) {
  const store = useMemo(() => {
    return createTLStore({ shapeUtils: defaultShapeUtils });
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const handleRemotePatch = (data: any) => {
      if (!data || !data.patch) return;
      const { patch } = data;
      console.log('Remote patch received from phone:', patch);
      
      try {
        store.mergeRemoteChanges(() => {
          const { added, updated, removed } = patch;
          
          if (added) {
            const shapesOnly = Object.values(added).filter((record: any) => record && record.id && record.id.startsWith('shape:'));
            if (shapesOnly.length > 0) store.put(shapesOnly as any[]);
          }
          if (updated) {
            const shapesOnly = Object.values(updated)
              .map((u: any) => u && u[1])
              .filter((record: any) => record && record.id && record.id.startsWith('shape:'));
            if (shapesOnly.length > 0) store.put(shapesOnly as any[]);
          }
          if (removed) {
            const shapesOnly = Object.keys(removed).filter((id) => id && id.startsWith('shape:'));
            if (shapesOnly.length > 0) store.remove(shapesOnly as any[]);
          }
        });
      } catch (err) {
        console.error('Failed to apply remote patch:', err);
      }
    };

    socket.on(SOCKET_EVENTS.TLDRAW_PATCH, handleRemotePatch);

    const unlisten = store.listen(
      (entry) => {
        try {
          if (entry.source !== 'user') return;
          const { added, updated, removed } = entry.changes;
          const filteredAdded = Object.fromEntries(Object.entries(added).filter(([id]) => id.startsWith('shape:')));
          const filteredUpdated = Object.fromEntries(Object.entries(updated).filter(([id]) => id.startsWith('shape:')));
          const filteredRemoved = Object.fromEntries(Object.entries(removed).filter(([id]) => id.startsWith('shape:')));

          if (Object.keys(filteredAdded).length > 0 || Object.keys(filteredUpdated).length > 0 || Object.keys(filteredRemoved).length > 0) {
            console.log('Sending filtered patch to phone:', { added: Object.keys(filteredAdded), updated: Object.keys(filteredUpdated), removed: Object.keys(filteredRemoved) });
            socket.emit(SOCKET_EVENTS.TLDRAW_PATCH, { roomId, patch: { added: filteredAdded, updated: filteredUpdated, removed: filteredRemoved } });
          }
        } catch (err) {
          console.error('Error in desktop store listener:', err);
        }
      },
      { source: 'user', scope: 'document' }
    );

    return () => {
      socket.off(SOCKET_EVENTS.TLDRAW_PATCH, handleRemotePatch);
      unlisten();
    };
  }, [roomId, store]);

  return store;
}
