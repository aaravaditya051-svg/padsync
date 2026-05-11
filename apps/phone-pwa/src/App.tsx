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

export default function App() {
  const [roomCode, setRoomCode] = useState('');
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');
  const store = useSyncStore(joined ? roomCode : null);

  useEffect(() => {
    socket.on(SOCKET_EVENTS.ROOM_JOINED, () => {
      setJoined(true);
      setError('');
    });

    socket.on(SOCKET_EVENTS.ROOM_ERROR, (err: any) => {
      setError(err.message || 'Room not found. Check the code and try again.');
      setJoined(false);
    });

    // Auto-join if QR code was scanned (URL has ?room=XXXX)
    const urlRoom = getRoomFromUrl();
    if (urlRoom) {
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
      socket.off(SOCKET_EVENTS.ROOM_JOINED);
      socket.off(SOCKET_EVENTS.ROOM_ERROR);
      socket.disconnect();
    };
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
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
        </div>
      </div>

      <div className="canvas-wrapper">
        <div className="canvas-inner">
          <Tldraw store={store} />
        </div>
      </div>
    </div>
  );
}
