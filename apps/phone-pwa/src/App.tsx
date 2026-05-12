// responsibility: phone PWA root — pairing screen with QR auto-join, canvas with toolbar
import { useState, useEffect } from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import './index.css';
import './App.css';
import { socket } from './services/socket';
import { SOCKET_EVENTS } from 'shared/events';
import { useSyncStore } from './hooks/useSyncStore';
import { getRoomFromUrl } from './utils/getRoomFromUrl';

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [roomCode, setRoomCode] = useState('');
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');
  const store = useSyncStore(joined ? roomCode : null);

  const [debugLog, setDebugLog] = useState<string[]>([]);
  const addLog = (msg: string) => {
    console.log(`[DEBUG] ${msg}`);
    setDebugLog(prev => [msg, ...prev].slice(0, 5));
  };

  useEffect(() => {
    addLog(`App started. Socket ID: ${socket.id || 'not connected'}`);

    socket.on('connect', () => {
      addLog(`Connected to server! ID: ${socket.id}`);
    });

    socket.on('disconnect', (reason) => {
      addLog(`Disconnected: ${reason}`);
      if (reason === 'io server disconnect' || reason === 'transport close') {
        setJoined(false);
        setError(`Disconnected: ${reason}. Please reconnect.`);
      }
    });

    socket.on('connect_error', (err) => {
      addLog(`Connection error: ${err.message}`);
      setError(`Connection error: ${err.message}`);
    });

    socket.on(SOCKET_EVENTS.ROOM_JOINED, (data) => {
      addLog(`Joined room: ${data.roomId}`);
      setJoined(true);
      setError('');
    });

    socket.on(SOCKET_EVENTS.ROOM_ERROR, (err: any) => {
      addLog(`Room error: ${err.message}`);
      setError(err.message || 'Room not found.');
      setJoined(false);
    });

    // Auto-join logic...
    const urlRoom = getRoomFromUrl();
    if (urlRoom) {
      addLog(`Auto-joining room from URL: ${urlRoom}`);
      setRoomCode(urlRoom.toUpperCase());
      if (socket.connected) {
        socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId: urlRoom.toUpperCase() });
      } else {
        socket.once('connect', () => {
          socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId: urlRoom.toUpperCase() });
        });
      }
    }

    if (!socket.connected) {
      addLog('Initiating socket connection...');
      socket.connect();
    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off(SOCKET_EVENTS.ROOM_JOINED);
      socket.off(SOCKET_EVENTS.ROOM_ERROR);
    };
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    addLog(`Manual join requested for: ${roomCode}`);
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId: roomCode.toUpperCase() });
  };

  if (!joined) {
    return (
      <div className="pairing-screen">
        <div className="pairing-card">
          <h1 className="pairing-title">PadSync</h1>
          <p className="pairing-subtitle">Enter the room code shown on your desktop</p>
          <form onSubmit={handleJoin} className="pairing-form">
            <input
              type="text"
              id="room-code-input"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="ABC-123"
              className="room-code-input"
              maxLength={7}
            />
            {error && <div className="error-text">{error}</div>}
            <button type="submit" id="connect-btn" className="connect-btn">
              Connect to Canvas
            </button>
          </form>
          <div style={{ marginTop: '20px', fontSize: '10px', color: '#999', textAlign: 'left' }}>
            {debugLog.map((log, i) => <div key={i}>{log}</div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-app">
      <div className="topbar">
        <span className="wordmark">PadSync</span>
        <div className="status-pill">
          <div className={`status-dot ${joined ? 'connected' : 'disconnected'}`} />
          {joined ? 'Connected' : 'Reconnecting...'}
          <button onClick={() => window.location.reload()} style={{ marginLeft: '8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '10px' }}>
            🔄
          </button>
        </div>
      </div>

      <div className="canvas-wrapper">
        <ErrorBoundary>
          <div className="canvas-inner" style={{ position: 'relative' }}>
            <Tldraw store={store} autoFocus />
            {!joined && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, color: '#666', flexDirection: 'column', gap: '12px' }}>
                <div className="spinner" />
                <span>Connection Lost. Reconnecting...</span>
                <div style={{ fontSize: '10px', marginTop: '10px' }}>
                  {debugLog.map((log, i) => <div key={i}>{log}</div>)}
                </div>
              </div>
            )}
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
