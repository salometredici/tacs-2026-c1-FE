import { useEffect, useState } from 'react';
import { UpcomingMatch } from '../../../interfaces/matches/UpcomingMatch';
import {
  MatchesCard as Section, SectionHeader, SectionIcon, SectionTitle, EmptyMessage,
  MatchesCountdown, CountdownLabel, CountdownValue,
  MatchesList, MatchRow, MatchTeam, MatchCrest, MatchTeamName, MatchVs, MatchInfo,
} from '../HomePage.styles';

interface Props {
  matches: UpcomingMatch[];
  loading: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Tiempo restante hasta `target` (ms epoch). Null si ya pasó. */
function formatRemaining(target: number, now: number): string | null {
  const diff = target - now;
  if (diff <= 0) return null;
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return days > 0
    ? `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
    : `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

function formatKickoff(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function UpcomingMatchesSection({ matches, loading }: Props) {
  const firstKickoff = matches[0]?.kickoff ?? null;
  const target = firstKickoff ? new Date(firstKickoff).getTime() : null;
  const [now, setNow] = useState(() => Date.now());

  // Tick cada segundo solo si hay un partido futuro al cual contar.
  useEffect(() => {
    if (target === null || Number.isNaN(target)) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const countdown = target !== null && !Number.isNaN(target) ? formatRemaining(target, now) : null;

  return (
    <Section>
      <SectionHeader>
        <SectionIcon>
          <span className="material-symbols-outlined" aria-hidden="true">sports_soccer</span>
        </SectionIcon>
        <SectionTitle>Próximos partidos del Mundial</SectionTitle>
      </SectionHeader>

      {loading ? (
        <EmptyMessage>Cargando partidos...</EmptyMessage>
      ) : matches.length === 0 ? (
        <EmptyMessage>No hay próximos partidos por ahora.</EmptyMessage>
      ) : (
        <>
          {countdown && (
            <MatchesCountdown>
              <CountdownLabel>Próximo partido en</CountdownLabel>
              <CountdownValue>{countdown}</CountdownValue>
            </MatchesCountdown>
          )}
          <MatchesList>
            {matches.map((m, i) => (
              <MatchRow key={`${m.homeTeam}-${m.awayTeam}-${m.kickoff}-${i}`}>
                <MatchTeam>
                  {m.homeCrest && <MatchCrest src={m.homeCrest} alt="" />}
                  <MatchTeamName>{m.homeTeam ?? '—'}</MatchTeamName>
                </MatchTeam>
                <MatchVs>vs</MatchVs>
                <MatchTeam>
                  {m.awayCrest && <MatchCrest src={m.awayCrest} alt="" />}
                  <MatchTeamName>{m.awayTeam ?? '—'}</MatchTeamName>
                </MatchTeam>
                <MatchInfo>
                  {formatKickoff(m.kickoff)}{m.venue ? ` · ${m.venue}` : ''}
                </MatchInfo>
              </MatchRow>
            ))}
          </MatchesList>
        </>
      )}
    </Section>
  );
}
