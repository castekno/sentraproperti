export function createProjectSlug(name: string): string {
  if (!name) return '';
  const trimmed = name.trim().toLowerCase();
  
  // Specific match for existing indexed URL with trailing dash
  if (trimmed.includes('qeena jeju residence') && trimmed.includes('ready stock')) {
    return 'qeena-jeju-residence-ready-stock-';
  }

  return trimmed
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
