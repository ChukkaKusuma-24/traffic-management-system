export function formatPercent(value) {
  return `${(Number(value) * 100).toFixed(1)}%`;
}

export function formatDateTime(value) {
  return new Date(value).toLocaleString();
}

export function formatNumber(value) {
  return Number(value).toLocaleString();
}
