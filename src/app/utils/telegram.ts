type TelegramWebApp = {
  initData: string;                 // string FIRMADO (lo valida el bot)
  initDataUnsafe: { user?: { id: number; first_name?: string } };
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor?: (c: string) => void;
  disableVerticalSwipes?: () => void;
};

export const getTelegram = (): TelegramWebApp | null =>
  (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp ?? null;

export const isInsideTelegram = (): boolean => {
  const tg = getTelegram();
  return !!tg && typeof tg.initData === 'string' && tg.initData.length > 0;
};

export const initTelegram = (): void => {
  const tg = getTelegram();
  if (!tg) return;
  tg.ready();
  tg.expand();
  tg.disableVerticalSwipes?.();
  tg.setHeaderColor?.('#4B2D7F');
};
