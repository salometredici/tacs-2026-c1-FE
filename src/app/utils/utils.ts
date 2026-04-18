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
