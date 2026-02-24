type LinearProgressProps = {
  variant?: "determinate" | "indeterminate";
  value?: number;
  style?: React.CSSProperties;
};

export function LinearProgress({ variant = "determinate", value = 0, style }: LinearProgressProps) {
  const width = variant === "determinate" ? Math.min(100, Math.max(0, value)) : undefined;
  return (
    <div className="ui-linear-progress" style={style}>
      <div
        className="ui-linear-progress-bar"
        style={{ width: width != null ? `${width}%` : "30%", animation: variant === "indeterminate" ? "linear-progress-pulse 1.5s ease-in-out infinite" : undefined }}
      />
    </div>
  );
}
