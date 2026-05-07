export function toISOStringWithoutMilliseconds(date: Date): string {
  return date.toISOString().replace('.000Z', 'Z');
}