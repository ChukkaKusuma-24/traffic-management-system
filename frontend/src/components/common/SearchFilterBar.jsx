export function SearchFilterBar({ query, onQueryChange, placeholder = "Search..." }) {
  return (
    <div className="flex w-full items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
      <span className="text-slate-300">Search</span>
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
      />
    </div>
  );
}
