export default function FilterBar({ groups, filter, onFilterChange }) {
    return (
      <div className="filter-bar">
        <select
          value={filter.group}
          onChange={e => onFilterChange({ ...filter, group: e.target.value })}
        >
          <option value="">All groups</option>
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <input
          type="search"
          placeholder="Search channels…"
          value={filter.search}
          onChange={e => onFilterChange({ ...filter, search: e.target.value })}
        />
      </div>
    );
  }
  