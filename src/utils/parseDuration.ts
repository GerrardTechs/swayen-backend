// Parser sederhana untuk string durasi bergaya JWT ("15m", "7d", "1h", "30s")
// Dipakai untuk menghitung expiresAt pada RefreshToken tanpa dependency tambahan.
const UNIT_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
};

export function parseDurationToMs(input: string): number {
  const match = /^(\d+)\s*(s|m|h|d|w)$/i.exec(input.trim());
  if (!match) {
    throw new Error(`Format durasi tidak valid: "${input}". Gunakan contoh "15m", "7d", "1h".`);
  }
  const [, value, unit] = match;
  return Number(value) * UNIT_MS[unit.toLowerCase()];
}

export function addDuration(base: Date, durationStr: string): Date {
  return new Date(base.getTime() + parseDurationToMs(durationStr));
}
