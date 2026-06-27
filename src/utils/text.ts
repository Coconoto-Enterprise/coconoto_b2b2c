export function truncatePreview(input?: string, max = 140): string {
  if (!input) return '';
  // Remove HTML tags
  const withoutTags = input.replace(/<[^>]+>/g, '');
  // Collapse whitespace
  const cleaned = withoutTags.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= max) return cleaned;
  return cleaned.slice(0, max - 1).trim() + '…';
}

export default truncatePreview;
