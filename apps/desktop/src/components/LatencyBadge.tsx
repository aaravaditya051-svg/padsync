// responsibility: displays live latency in the desktop stats bar
interface LatencyBadgeProps {
  latencyMs: number | null;
  visible: boolean;
}

// Colour-codes latency based on design guideline thresholds
function getLatencyColor(ms: number): string {
  if (ms < 20) return '#3DD68C';
  if (ms <= 50) return '#FFD166';
  return '#E05A6A';
}

export function LatencyBadge({ latencyMs, visible }: LatencyBadgeProps) {
  if (!visible || latencyMs === null) return null;

  const color = getLatencyColor(latencyMs);

  return (
    <div className="latency-badge" style={{ color }}>
      Latency: <strong>{latencyMs}ms</strong>
    </div>
  );
}
