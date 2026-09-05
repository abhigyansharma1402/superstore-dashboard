import { currency } from "../utils/aggregate";

export default function KpiCards({ rows }) {
  const sales = rows.reduce((s, r) => s + r.sales, 0);
  const profit = rows.reduce((s, r) => s + r.profit, 0);
  const units = rows.reduce((s, r) => s + r.quantityOrdered, 0);
  const orders = new Set(rows.map((r) => r.orderId)).size;
  const margin = sales ? (profit / sales) * 100 : 0;

  const cards = [
    { label: "Total Revenue", value: currency(sales), sub: `${orders.toLocaleString("en-US")} orders` },
    { label: "Total Profit", value: currency(profit), sub: `${margin.toFixed(1)}% margin` },
    { label: "Units Sold", value: units.toLocaleString("en-US"), sub: `${rows.length.toLocaleString("en-US")} line items` },
    {
      label: "Avg Line Value",
      value: currency(rows.length ? sales / rows.length : 0),
      sub: "per order line",
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((c, i) => (
        <div className="kpi-card" key={c.label} style={{ "--i": i }}>
          <p className="kpi-label">{c.label}</p>
          <p className="kpi-value">{c.value}</p>
          <p className="kpi-sub">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
