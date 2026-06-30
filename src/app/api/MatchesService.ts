import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { UpcomingMatch } from '../interfaces/matches/UpcomingMatch';

// Bonus: próximos partidos del Mundial. Lee del cache del BE (poblado por cron diario).
export const getUpcomingMatches = async (): Promise<UpcomingMatch[]> => {
  const response = await axios.get<UpcomingMatch[]>(API_CONFIG.matches.upcoming);
  return response.data ?? [];
};
