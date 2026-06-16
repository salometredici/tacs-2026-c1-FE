import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StatsPeriod, Timeseries } from '../../../api/AdminStatsService';
import {
  TimeseriesCard, TimeseriesTitle, TimeseriesTotal,
  PeriodToggleGroup, PeriodToggleButton,
} from '../AdminDashboardPage.styles';
import { theme } from '../../../styles/theme';

const PERIOD_LABEL: Record<StatsPeriod, string> = { day: 'Día', week: 'Semana', month: 'Mes' };
const PERIODS: StatsPeriod[] = ['day', 'week', 'month'];

// Eje X compacto — sólo día del mes ("9", "10", "11"…) — la fecha completa va en el tooltip.
const formatXAxisLabel = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : String(d.getDate());
};

// Tooltip — fecha legible en español rioplatense.
// Recharts pasa el label como ReactNode (incluye undefined); coerce a string para parsear.
const formatTooltipLabel = (label: unknown): string => {
  const iso = String(label ?? '');
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' });
};

// Recharts pasa value como ValueType (number | string | array | undefined). Coerce a number.
const formatTooltipValue = (value: unknown): [number, string] => [Number(value ?? 0), 'Cantidad'];

interface Props {
  label: string;
  loader: (period: StatsPeriod) => Promise<Timeseries>;
}

// Capa 2 — dropdown independiente por métrica. Cada panel mantiene su propio period
// y dispara un AreaChart con el desglose diario que devuelve el BE (campo `daily`).
export default function TimeseriesPanel({ label, loader }: Props) {
  const [period, setPeriod] = useState<StatsPeriod>('week');
  const [data, setData] = useState<Timeseries | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loader(period)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [loader, period]);

  const showChart = !loading && data && data.daily.length > 1;

  return (
    <TimeseriesCard>
      <TimeseriesTitle>{label}</TimeseriesTitle>
      <TimeseriesTotal>
        {loading ? '…' : data ? data.total.toLocaleString('es-AR') : 'N/D'}
      </TimeseriesTotal>

      {showChart && (
        <div style={{ width: '100%', height: 120 }}>
          <ResponsiveContainer>
            <AreaChart data={data!.daily} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={theme.colors.primary} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={theme.colors.primary} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.outlineVariant} vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatXAxisLabel}
                     tick={{ fontSize: 11, fill: theme.colors.onSurfaceVariant }}
                     axisLine={false} tickLine={false} />
              <YAxis hide allowDecimals={false} />
              <Tooltip
                labelFormatter={formatTooltipLabel}
                formatter={formatTooltipValue}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Area type="monotone" dataKey="count"
                    stroke={theme.colors.primary} strokeWidth={2}
                    fill={`url(#grad-${label})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <PeriodToggleGroup role="group" aria-label={`Período de ${label}`}>
        {PERIODS.map(p => (
          <PeriodToggleButton key={p} $active={p === period} onClick={() => setPeriod(p)}>
            {PERIOD_LABEL[p]}
          </PeriodToggleButton>
        ))}
      </PeriodToggleGroup>
    </TimeseriesCard>
  );
}
