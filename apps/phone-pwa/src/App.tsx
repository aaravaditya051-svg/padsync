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

  useEffect(() => {
    console.log('App effect started. Socket ID:', socket.id);

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
      if (reason === 'io server disconnect' || reason === 'transport close') {
        setJoined(false);
        setError(`Disconnected: ${reason}. Please reconnect.`);
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError(`Connection error: ${err.message}`);
    });

    socket.on(SOCKET_EVENTS.ROOM_JOINED, (data) => {
      console.log('Joined room:', data);
      setJoined(true);
      setError('');
    });

    socket.on(SOCKET_EVENTS.ROOM_ERROR, (err: any) => {
      console.error('Room error:', err);
      setError(err.message || 'Room not found. Check the code and try again.');
      setJoined(false);
    });

    // Auto-join if QR code was scanned (URL has ?room=XXXX)
    const urlRoom = getRoomFromUrl();
    if (urlRoom) {
      console.log('Auto-joining from URL:', urlRoom);
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
    console.log('Manually joining room:', roomCode);
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
        </div>
      </div>
    );
  }

  return (
    <div className="phone-app">
      <div className="topbar">
        <span className="wordmark">PadSync</span>
        <div className="status-pill">
          <div className="status-dot connected" />
          Connected
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginLeft: '8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '10px' }}
          >
            🔄
          </button>
        </div>
      </div>

      <div className="canvas-wrapper">
        <ErrorBoundary>
          <div className="canvas-inner">
            {joined ? (
              <Tldraw store={store} autoFocus />
            ) : (
              <div className="canvas-placeholder">Initializing canvas...</div>
            )}
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
