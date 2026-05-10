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
      store.mergeRemoteChanges(() => {
        const { added, updated, removed } = patch;
        
        if (added) {
          store.put(Object.values(added) as any[]);
        }
        if (updated) {
          store.put(Object.values(updated).map((u: any) => u[1]));
        }
        if (removed) {
          store.remove(Object.keys(removed) as any[]);
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
