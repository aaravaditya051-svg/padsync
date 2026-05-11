// responsibility: displays QR code and room code for phone pairing on the desktop sidebar
import { QRCodeSVG } from 'qrcode.react';

interface QRCodePanelProps {
  roomId: string;
  phoneConnected: boolean;
}

// The phone URL to embed in the QR code — points to the phone app with the room pre-filled
function buildPhoneUrl(roomId: string): string {
  const phoneAppUrl = import.meta.env.VITE_PHONE_APP_URL || 'https://padsync.netlify.app';
  
  // Ensure no double slash if the URL has a trailing one
  const baseUrl = phoneAppUrl.endsWith('/') ? phoneAppUrl.slice(0, -1) : phoneAppUrl;
  return `${baseUrl}/?room=${roomId}`;
}

export function QRCodePanel({ roomId, phoneConnected }: QRCodePanelProps) {
  if (phoneConnected) {
    return (
      <div className="qr-panel connected">
        <div className="qr-connected-badge">● Phone Connected</div>
        <div className="qr-room-code">{roomId}</div>
      </div>
    );
  }

  return (
    <div className="qr-panel">
      <div className="qr-label">Scan to Connect</div>
      <div className="qr-code-box">
        <QRCodeSVG
          value={buildPhoneUrl(roomId)}
          size={120}
          fgColor="#2D3158"
          bgColor="transparent"
        />
      </div>
      <div className="qr-room-code">{roomId}</div>
      <div className="qr-hint">Or enter this code on your phone</div>
    </div>
  );
}
