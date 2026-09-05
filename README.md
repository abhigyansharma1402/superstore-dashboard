# Superstore — Sales Dashboard

A React + Vite dashboard that visualizes company order data with KPI cards, charts, and a
paginated, sortable, searchable orders table.

## Stack

- **React 19 + Vite** — app shell and dev/build tooling
- **Recharts** — the "inbuilt" charting library (area, bar, and pie/donut charts)
- Plain CSS (`src/App.css`) — no UI framework, custom light theme

## About the data

This dashboard runs on the **real "Sample - Superstore" dataset** — one of the most widely
used retail sales datasets for BI/dashboard practice (a Tableau sample dataset, also
commonly found on Kaggle). It was uploaded directly, so this is genuine data, not generated.

**Dataset facts:**
- **9,994 real order line items**
- **5,009 unique orders**, 793 customers
- Spans **Jan 2014 – Dec 2017**
- 3 categories (Furniture, Office Supplies, Technology), 17 sub-categories
- 4 US regions (Central, East, South, West)
- 4 ship modes (Standard Class, Second Class, First Class, Same Day)
- Total sales ≈ $2.3M, total profit ≈ $286K (≈12.5% margin)

**Fields used:** `orderId`, `orderDate`, `category`, `subCategory`, `productName`,
`quantityOrdered`, `discount`, `sales`, `profit`, `shipMode`, `region`, `state`, `city`,
`segment`, `customerName`. All of these are the real, unmodified values from the source CSV
(`src/data/Sample_-_Superstore.csv`, included in this project) — nothing here is estimated.

**One thing worth knowing:** each row is an *order line item*, not a whole order — a single
order (`orderId`) can span several rows if the customer bought multiple products in one
checkout. The KPI cards account for this (e.g. "orders" counts unique `orderId`s, not rows).

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

## What's inside

- `src/data/Sample_-_Superstore.csv` — the original uploaded dataset
- `convert_csv.py` — the script that converted the CSV into `salesData.js` (re-run it if you
  swap in a different CSV; not used at runtime)
- `src/data/salesData.js` — the dataset as a JS array, imported directly by the app
- `src/utils/aggregate.js` — pure functions that roll the flat rows up into monthly trend,
  by-category, and by-region shapes for the charts, plus a currency formatter
- `src/components/KpiCards.jsx` — total revenue, profit, units sold, avg line value
- `src/components/Charts.jsx` — Recharts area chart (monthly sales & profit), horizontal bar
  chart (revenue by category), and donut chart (revenue share by region)
- `src/components/Filters.jsx` — category / region filters that drive the KPIs, charts, and
  table together
- `src/components/OrdersTable.jsx` — sortable columns, a search box, and **pagination**
  (configurable rows-per-page, first/prev/next/last controls)
- `src/App.jsx` / `src/App.css` — layout and the visual theme

## Notes for the internship writeup

- Pagination lives entirely in `OrdersTable.jsx` (`page`, `pageSize` state + `slice()`), no
  extra library needed.
- Charts use `ResponsiveContainer` so they resize with the browser/container.
- The dashboard is filterable: picking a category or region updates KPIs, charts, and the
  table in one place (`filteredRows` in `App.jsx`).
- With ~10,000 rows embedded directly in the JS bundle, the production build is noticeably
  larger (~4MB uncompressed / ~630KB gzipped) than a small dataset would produce. Worth
  mentioning if asked about performance — a real production app with a dataset this size
  would typically fetch it from a backend/API instead of bundling it into the JS, so only
  the current page of data is ever loaded.

## Using a different CSV

1. Replace `src/data/Sample_-_Superstore.csv` with your own CSV.
2. Update the column mapping in `convert_csv.py` to match your CSV's headers, then run
   `python3 convert_csv.py` to regenerate `src/data/salesData.js`.
3. If your CSV's fields differ structurally, update the field names referenced in
   `src/utils/aggregate.js` and the `COLUMNS` array in `src/components/OrdersTable.jsx`.
