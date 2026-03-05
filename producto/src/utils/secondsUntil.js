export function secondsUntil(isoEndTime) {
  if (!isoEndTime) return 0;
  const endMs = new Date(isoEndTime).getTime();
  const nowMs = Date.now();
  const diffMs = endMs - nowMs;
  return Math.max(0, Math.ceil(diffMs / 1000));
}
