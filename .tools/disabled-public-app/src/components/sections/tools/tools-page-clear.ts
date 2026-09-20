import type { Dispatch, SetStateAction } from 'react';

export function handleToolsClear(
  setSearch: Dispatch<SetStateAction<string>>,
  setCategory: Dispatch<SetStateAction<string>>,
  setPage: Dispatch<SetStateAction<number>>,
) {
  setSearch('');
  setCategory('');
  setPage(1);
}
