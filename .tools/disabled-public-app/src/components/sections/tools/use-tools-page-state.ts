import { useEffect, useState } from 'react';
import { filterTools } from './filter-tools';

export function useToolsPageState(locale: string) {
  const [search, setSearch] = useState('');

  const [category, setCategory] = useState('');

  const [page, setPage] = useState(1);

  const filtered = filterTools({ category, locale, search });

  const pageSize = 20;

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  const visibleTools = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  return {
    category,
    page,
    pageCount,
    search,
    setCategory,
    setPage,
    setSearch,
    visibleTools,
  };
}
