import { theme } from '../styles/theme';

export function calcularTiempoRestante(endDate: string): { texto: string; color: string } {
  const ahora = new Date();
  const diferencia = new Date(endDate).getTime() - ahora.getTime();

  if (diferencia <= 0) {
    return { texto: 'Finalizada', color: theme.colors.error };
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (dias > 0) {
    return { texto: `${dias}d ${horas}h`, color: theme.colors.success };
  } else if (horas > 1) {
    return { texto: `${horas}h`, color: theme.colors.success };
  } else {
    return { texto: 'Termina pronto', color: theme.colors.warning };
  }
}
