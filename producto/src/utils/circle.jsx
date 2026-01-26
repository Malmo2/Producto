import '../components/globalStyles/circle.css'

export default function Circle({
  timeLeft,
  totalSeconds,
  radius = 70,
  size = 180,
  strokeWidth = 12,
  className = "",
  children,
}) {
  const safeTotal = Math.max(1, totalSeconds);
  const safeTimeLeft = Math.min(Math.max(0, timeLeft), safeTotal);

  const progress = safeTimeLeft / safeTotal;

  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const center = size / 2;

  return (
    <div
      className={`circle-wrap ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="circle-svg">
        <circle
          className="circle-bg"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className="circle-fg"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>

      <div className="circle-center">{children}</div>
    </div>
  );
}
