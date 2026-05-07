export function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(sr|sra|dr|dra)\b\.?/gi, '')
    .replace(/\b(de|da|do|dos|das)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}