// responsibility: measures round-trip socket latency and returns latest ms value
import { useEffect, useState, useRef } from 'react';
import { socket } from '../services/socket';

export function useLatency(active: boolean) {
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const start = Date.now();
      socket.emit('ping', () => {
        setLatencyMs(Date.now() - start);
      });
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  return latencyMs;
}
