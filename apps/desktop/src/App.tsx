// responsibility: desktop app root — QR pairing, live canvas, stats bar with latency
// PadSync Web Dashboard - Fresh Build Trigger
import { useEffect, useState } from 'react';
import { Tldraw, Editor } from 'tldraw';
import 'tldraw/tldraw.css';
import './index.css';
import './App.css';
import { socket } from './services/socket';
import { SOCKET_EVENTS } from 'shared/events';
import { useSyncStore } from './hooks/useSyncStore';
import { useLatency } from './hooks/useLatency';
import { QRCodePanel } from './components/QRCodePanel';
import { LatencyBadge } from './components/LatencyBadge';
import { ExportPanel } from './components/ExportPanel';

export default function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [phoneConnected, setPhoneConnected] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [editor, setEditor] = useState<Editor | null>(null);

  const store = useSyncStore(roomId);
  const latencyMs = useLatency(phoneConnected && debugMode);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      socket.emit(SOCKET_EVENTS.CREATE_ROOM);
    });

    socket.on(SOCKET_EVENTS.ROOM_CREATED, ({ roomId }: { roomId: string }) => {
      setRoomId(roomId);
    });

    socket.on(SOCKET_EVENTS.PHONE_CONNECTED, () => {
      setPhoneConnected(true);
    });

    // Count strokes relayed to the desktop
    socket.on(SOCKET_EVENTS.TLDRAW_PATCH, () => {
      setStrokeCount((c) => c + 1);
    });

    return () => {
      socket.off('connect');
      socket.off(SOCKET_EVENTS.ROOM_CREATED);
      socket.off(SOCKET_EVENTS.PHONE_CONNECTED);
      socket.off(SOCKET_EVENTS.TLDRAW_PATCH);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="desktop-app">
      {/* Top bar */}
      <div className="topbar">
        <span className="wordmark">PadSync</span>
        <div className="topbar-right">
          {roomId && (
            <div className="status-pill room-code-pill">
              Room: {roomId}
            </div>
          )}
          <div className="status-pill">
            <div className={`status-dot ${phoneConnected ? 'connected' : 'searching'}`} />
            {phoneConnected ? 'Phone Connected' : 'Waiting for Phone'}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="main-area">
        {/* Sidebar */}
        <div className="sidebar">
          {roomId && (
            <QRCodePanel roomId={roomId} phoneConnected={phoneConnected} />
          )}
          <div>
            <div className="sidebar-label">Canvas</div>
            <div className="sidebar-hint">Draw on your phone — strokes appear here live.</div>
          </div>
          <ExportPanel editor={editor} />
        </div>

        {/* Canvas */}
        <div className="canvas-area">
          {store
            ? <Tldraw hideUi={true} store={store} onMount={(e) => setEditor(e)} />
            : <div className="canvas-placeholder">Initializing canvas...</div>}
        </div>
      </div>

      {/* Stats bar */}
      <div className="stats-bar">
        <span className="stats-item">Strokes: {strokeCount}</span>
        <LatencyBadge latencyMs={latencyMs} visible={debugMode} />
        <span
          className="debug-toggle"
          onClick={() => setDebugMode((d) => !d)}
          title="Toggle latency debug mode"
        >
          {debugMode ? '🔵 Debug ON' : '⚪ Debug'}
        </span>
      </div>
    </div>
  );
}
