import { useMemo, useState } from "react";
import { salesData } from "./data/salesData";
import KpiCards from "./components/KpiCards";
import Charts from "./components/Charts";
import OrdersTable from "./components/OrdersTable";
import Filters from "./components/Filters";
import "./App.css";

export default function App() {
  const [filters, setFilters] = useState({ category: "all", region: "all" });

  const categories = useMemo(
    () => [...new Set(salesData.map((r) => r.category))].sort(),
    []
  );
  const regions = useMemo(() => [...new Set(salesData.map((r) => r.region))].sort(), []);

  const filteredRows = useMemo(() => {
    return salesData.filter((r) => {
      if (filters.category !== "all" && r.category !== filters.category) return false;
      if (filters.region !== "all" && r.region !== filters.region) return false;
      return true;
    });
  }, [filters]);

  const range = useMemo(() => {
    const dates = salesData.map((r) => r.orderDate).sort();
    return { from: dates[0], to: dates[dates.length - 1] };
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">SS</span>
          <div>
            <h1>Superstore</h1>
            <p>Retail sales &amp; profit analytics</p>
          </div>
        </div>
        <div className="header-meta">
          <span className="eyebrow">Data window</span>
          <span className="mono">
            {range.from} → {range.to}
          </span>
        </div>
      </header>

      <main>
        <Filters
          categories={categories}
          regions={regions}
          filters={filters}
          onChange={setFilters}
        />

        <KpiCards rows={filteredRows} />

        <Charts rows={filteredRows} />

        <OrdersTable rows={filteredRows} />
      </main>

      <footer className="app-footer">
        <p>
          Real dataset: "Sample - Superstore" — 9,994 order line items (Furniture, Office
          Supplies &amp; Technology), 2014–2017 — built with React, Vite &amp; Recharts.
        </p>
      </footer>
    </div>
  );
}
