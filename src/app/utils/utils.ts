export function formatCountdown(fechaCierre: string): { texto: string; urgente: boolean } {
  const diff = new Date(fechaCierre).getTime() - Date.now();
  if (diff <= 0) return { texto: 'Finalizada', urgente: true };
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h < 2) return { texto: `${h}h ${m}m`, urgente: true };
  if (h < 24) return { texto: `${h}h ${m}m`, urgente: false };
  const d = Math.floor(h / 24);
  return { texto: `${d}d ${h % 24}h`, urgente: false };
}

export function formatDuration(horas: number): string {
  if (horas < 24) return `${horas}h`;
  const dias = Math.floor(horas / 24);
  const resto = horas % 24;
  return resto > 0 ? `${dias}d ${resto}h` : `${dias}d`;
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
