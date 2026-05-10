// responsibility: defines all shared socket event names to prevent typos
export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  CREATE_ROOM: 'create-room',
  ROOM_CREATED: 'room-created',
  JOIN_ROOM: 'join-room',
  ROOM_JOINED: 'room-joined',
  ROOM_ERROR: 'room-error',
  PHONE_CONNECTED: 'phone-connected',
  PHONE_DISCONNECTED: 'phone-disconnected',
  TLDRAW_PATCH: 'tldraw-patch',
} as const;
