export default function Filters({ categories, regions, filters, onChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-field">
        <label>Category</label>
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label>Region</label>
        <select
          value={filters.region}
          onChange={(e) => onChange({ ...filters, region: e.target.value })}
        >
          <option value="all">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {(filters.category !== "all" || filters.region !== "all") && (
        <button className="filter-clear" onClick={() => onChange({ category: "all", region: "all" })}>
          Clear filters ×
        </button>
      )}
    </div>
  );
}
