// responsibility: reads the ?room= URL param on load to support QR code auto-join
export function getRoomFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('room');
}
