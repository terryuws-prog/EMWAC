export function formatTimestamp(value: string) {
  const d = new Date(value);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const day = d.getUTCDate();
  const mon = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${day} ${mon} ${year}, ${hh}:${mm}`;
}

export function formatMetric(value: number, digits = 1) {
  return value.toFixed(digits);
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}
