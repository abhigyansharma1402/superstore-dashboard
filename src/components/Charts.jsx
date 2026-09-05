import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { monthlyTrend, byCategory, byRegion, currency } from "../utils/aggregate";

const ACCENT = "#4f6f8f";
const TEAL = "#4c8577";
const PANEL = "#ffffff";
const PALETTE = ["#4f6f8f", "#4c8577", "#b98c4c", "#8c6bb1", "#c4644b", "#5b8fb9", "#9aa76b"];

function ChartCard({ eyebrow, title, children }) {
  return (
    <div className="chart-card">
      <div className="chart-card-head">
        <span className="eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
      </div>
      <div className="chart-card-body">{children}</div>
    </div>
  );
}

function TooltipBox({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label && <p className="chart-tooltip-label">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey || p.name} style={{ color: p.color || p.fill }}>
          {p.name}: {typeof p.value === "number" ? currency(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

export default function Charts({ rows }) {
  const trend = monthlyTrend(rows);
  const categories = byCategory(rows);
  const regions = byRegion(rows);

  return (
    <div className="charts-grid">
      <ChartCard eyebrow="01 — Revenue over time" title="Monthly Sales &amp; Profit">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={trend} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.55} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TEAL} stopOpacity={0.5} />
                <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(36,38,43,0.08)" vertical={false} />
            <XAxis dataKey="label" stroke="rgba(36,38,43,0.5)" tick={{ fontSize: 11 }} />
            <YAxis
              stroke="rgba(36,38,43,0.5)"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<TooltipBox />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#24262b" }} />
            <Area type="monotone" dataKey="sales" name="Sales" stroke={ACCENT} fill="url(#salesFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="profit" name="Profit" stroke={TEAL} fill="url(#profitFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard eyebrow="02 — By product line" title="Revenue by Category">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={categories} layout="vertical" margin={{ top: 8, right: 20, left: 8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(36,38,43,0.08)" horizontal={false} />
            <XAxis type="number" stroke="rgba(36,38,43,0.5)" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="rgba(36,38,43,0.5)"
              tick={{ fontSize: 11 }}
              width={110}
            />
            <Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(36,38,43,0.04)" }} />
            <Bar dataKey="sales" name="Sales" radius={[0, 4, 4, 0]}>
              {categories.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard eyebrow="03 — By region" title="Revenue Share">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Tooltip content={<TooltipBox />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#24262b" }} />
            <Pie
              data={regions}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              stroke={PANEL}
              strokeWidth={2}
            >
              {regions.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
