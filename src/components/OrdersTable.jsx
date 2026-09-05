import { useMemo, useState } from "react";
import { currency } from "../utils/aggregate";

const COLUMNS = [
  { key: "orderId", label: "Order ID" },
  { key: "orderDate", label: "Date" },
  { key: "customerName", label: "Customer" },
  { key: "category", label: "Category" },
  { key: "subCategory", label: "Sub-Category" },
  { key: "quantityOrdered", label: "Qty" },
  { key: "sales", label: "Sales" },
  { key: "profit", label: "Profit" },
  { key: "region", label: "Region" },
  { key: "shipMode", label: "Ship Mode" },
];

const PAGE_SIZES = [10, 15, 25, 50];

export default function OrdersTable({ rows }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("orderDate");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = rows;
    if (q) {
      data = data.filter((r) =>
        [
          r.orderId,
          r.customerName,
          r.category,
          r.subCategory,
          r.productName,
          r.region,
          r.state,
          r.city,
          r.shipMode,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    const sorted = [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [rows, query, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function toggleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function goToPage(p) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  return (
    <div className="table-panel">
      <div className="table-toolbar">
        <div>
          <span className="eyebrow">04 — Order ledger</span>
          <h3>All Orders</h3>
        </div>
        <input
          className="table-search"
          type="text"
          placeholder="Search customer, product, region, ship mode…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.key} onClick={() => toggleSort(c.key)}>
                  {c.label}
                  <span className="sort-arrow">
                    {sortKey === c.key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => (
              <tr key={`${r.orderId}-${i}`}>
                <td className="mono">{r.orderId}</td>
                <td className="mono">{r.orderDate}</td>
                <td>{r.customerName}</td>
                <td>{r.category}</td>
                <td>{r.subCategory}</td>
                <td className="mono">{r.quantityOrdered}</td>
                <td className="mono">{currency(r.sales)}</td>
                <td className="mono profit">{currency(r.profit)}</td>
                <td>{r.region}</td>
                <td>
                  <span className={`status-pill status-${r.shipMode.replace(/\s/g, "").toLowerCase()}`}>
                    {r.shipMode}
                  </span>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="empty-row">
                  No orders match "{query}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <div className="page-size">
          <label htmlFor="pageSize">Rows per page</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="page-info">
          Showing {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, filtered.length)} of{" "}
          {filtered.length}
        </div>

        <div className="page-controls">
          <button onClick={() => goToPage(1)} disabled={safePage === 1}>
            «
          </button>
          <button onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>
            ‹
          </button>
          <span className="page-current">
            {safePage} / {totalPages}
          </span>
          <button onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}>
            ›
          </button>
          <button onClick={() => goToPage(totalPages)} disabled={safePage === totalPages}>
            »
          </button>
        </div>
      </div>
    </div>
  );
}
