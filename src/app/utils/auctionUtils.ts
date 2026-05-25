import { theme } from '../styles/theme';

export function getRemainingTime(endDate: string): { text: string; color: string } {
  const now = new Date();
  const diff = new Date(endDate).getTime() - now.getTime();

  if (diff <= 0) {
    return { text: 'Finalizada', color: theme.colors.error };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return { text: `${days}d ${hours}h`, color: theme.colors.success };
  } else if (hours > 1) {
    return { text: `${hours}h`, color: theme.colors.success };
  } else {
    return { text: 'Termina pronto', color: theme.colors.warning };
  }
}
