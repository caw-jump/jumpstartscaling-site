export function stripHtml(input: string): string {
  return (input || '').replace(/<[^>]*>/g, '').trim();
}

export function toMobileBadgeText(input: string, maxChars: number = 20): string {
  const text = stripHtml(input);
  if (text.length <= maxChars) return text;

  const ellipsis = '…';
  const max = Math.max(0, maxChars - ellipsis.length);
  return text.slice(0, max).trimEnd() + ellipsis;
}
