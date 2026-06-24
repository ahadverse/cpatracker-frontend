import {
  Bar,
  BarChart as RBarChart,
  CartesianGrid,
  Line,
  LineChart as RLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Theme-token colors (CSS vars resolve at paint time; recharts needs a CSS color
// string, so we reference the var() directly rather than a Tailwind class).
const SERIES_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--info))',
];

export interface ChartSeries {
  key: string;
  label?: string;
  color?: string;
}

export interface ChartProps {
  type?: 'line' | 'bar';
  data: Record<string, unknown>[];
  xKey: string;
  series: ChartSeries[];
  height?: number;
}

export function Chart({ type = 'line', data, xKey, series, height = 280 }: ChartProps) {
  const ChartComponent = type === 'bar' ? RBarChart : RLineChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ChartComponent data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
            color: 'hsl(var(--popover-foreground))',
          }}
        />
        {series.map((s, i) =>
          type === 'bar' ? (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label ?? s.key}
              fill={s.color ?? SERIES_COLORS[i % SERIES_COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ) : (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label ?? s.key}
              stroke={s.color ?? SERIES_COLORS[i % SERIES_COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          ),
        )}
      </ChartComponent>
    </ResponsiveContainer>
  );
}
