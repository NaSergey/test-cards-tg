export function parseCountInput(raw: string): { count: number | undefined; active: boolean } {
  const s = raw.trim();
  if (s.startsWith("+")) {
    const n = parseInt(s.slice(1), 10);
    if (!isNaN(n) && n >= 1 && n <= 999) return { count: n, active: true };
    return { count: undefined, active: false };
  }
  const n = parseInt(s, 10);
  if (isNaN(n) || n < 0) return { count: undefined, active: false };
  if (n === 0) return { count: 0, active: false };
  if (n <= 9999) return { count: n, active: false };
  return { count: 9999, active: false };
}
