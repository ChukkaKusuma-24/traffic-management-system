import { useMemo, useState } from "react";

export function useSearchFilter(items, keySelector) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) => keySelector(item).toLowerCase().includes(normalized));
  }, [items, keySelector, query]);

  return { query, setQuery, filtered };
}
