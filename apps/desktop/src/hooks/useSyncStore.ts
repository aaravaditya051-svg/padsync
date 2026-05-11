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

    const handleRemotePatch = ({ patch }: { patch: any }) => {
      console.log('Remote patch received from phone:', patch);
      store.mergeRemoteChanges(() => {
        const { added, updated, removed } = patch;
        
        if (added) {
          const shapesOnly = Object.values(added).filter((record: any) => record.id.startsWith('shape:'));
          if (shapesOnly.length > 0) store.put(shapesOnly as any[]);
        }
        if (updated) {
          const shapesOnly = Object.values(updated)
            .map((u: any) => u[1])
            .filter((record: any) => record.id.startsWith('shape:'));
          if (shapesOnly.length > 0) store.put(shapesOnly as any[]);
        }
        if (removed) {
          const shapesOnly = Object.keys(removed).filter((id) => id.startsWith('shape:'));
          if (shapesOnly.length > 0) store.remove(shapesOnly as any[]);
        }
      });
    };

    socket.on(SOCKET_EVENTS.TLDRAW_PATCH, handleRemotePatch);

    const unlisten = store.listen(
      (entry) => {
        if (entry.source !== 'user') return;
        socket.emit(SOCKET_EVENTS.TLDRAW_PATCH, { roomId, patch: entry.changes });
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
