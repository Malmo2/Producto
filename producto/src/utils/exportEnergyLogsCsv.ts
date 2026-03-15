type EnergyLog = {
  id: string;
  level: number;
  createdAt: number | string;
  sessionId?: string | number;
};

function escapeCsv(value: unknown) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportEnergyLogsCsv(logs: EnergyLog[]) {
  if (!logs.length) return;

  const header = ["id", "level", "createdAt", "date", "time", "sessionId"];

  const rows = logs.map((log) => {
    const date = new Date(log.createdAt);

    return [
      log.id,
      log.level,
      log.createdAt,
      date.toLocaleDateString(),
      date.toLocaleTimeString(),
      log.sessionId ?? "",
    ];
  });

  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `energy-logs-${new Date().toISOString().slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
