export function formatCountdown(closingDate: string): { text: string; urgent: boolean } {
  const diff = new Date(closingDate).getTime() - Date.now();
  if (diff <= 0) return { text: 'Finalizada', urgent: true };
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h < 2) return { text: `${h}h ${m}m`, urgent: true };
  if (h < 24) return { text: `${h}h ${m}m`, urgent: false };
  const d = Math.floor(h / 24);
  return { text: `${d}d ${h % 24}h`, urgent: false };
}

export function formatDuration(hours: number): string {
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const remainder = hours % 24;
  return remainder > 0 ? `${days}d ${remainder}h` : `${days}d`;
}

export function formatTimeAgo(isoDate: string): string {
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86400000);
  if (days <= 0) return 'hoy';
  if (days === 1) return 'ayer';
  if (days < 7) return `hace ${days} días`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`;
  }
  const months = Math.floor(days / 30);
  return months === 1 ? 'hace 1 mes' : `hace ${months} meses`;
}
