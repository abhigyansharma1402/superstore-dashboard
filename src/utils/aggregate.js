// Small helpers that turn the flat order list into chart/table-ready shapes.

export function currency(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function totalSales(rows) {
  return rows.reduce((sum, r) => sum + r.sales, 0);
}

export function totalProfit(rows) {
  return rows.reduce((sum, r) => sum + r.profit, 0);
}

export function totalUnits(rows) {
  return rows.reduce((sum, r) => sum + r.quantityOrdered, 0);
}

// Monthly sales + profit trend, sorted chronologically.
export function monthlyTrend(rows) {
  const map = new Map();
  for (const r of rows) {
    const key = r.orderDate.slice(0, 7); // YYYY-MM
    const entry = map.get(key) || { month: key, sales: 0, profit: 0 };
    entry.sales += r.sales;
    entry.profit += r.profit;
    map.set(key, entry);
  }
  return [...map.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((e) => ({
      ...e,
      label: new Date(e.month + "-02").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      sales: +e.sales.toFixed(0),
      profit: +e.profit.toFixed(0),
    }));
}

// Sales grouped by category, sorted descending.
export function byCategory(rows) {
  const map = new Map();
  for (const r of rows) {
    const entry = map.get(r.category) || { name: r.category, sales: 0, units: 0 };
    entry.sales += r.sales;
    entry.units += r.quantityOrdered;
    map.set(r.category, entry);
  }
  return [...map.values()]
    .sort((a, b) => b.sales - a.sales)
    .map((e) => ({ ...e, sales: +e.sales.toFixed(0) }));
}

// Sales share by region, for the pie chart.
export function byRegion(rows) {
  const map = new Map();
  for (const r of rows) {
    const entry = map.get(r.region) || { name: r.region, value: 0 };
    entry.value += r.sales;
    map.set(r.region, entry);
  }
  return [...map.values()]
    .sort((a, b) => b.value - a.value)
    .map((e) => ({ ...e, value: +e.value.toFixed(0) }));
}
