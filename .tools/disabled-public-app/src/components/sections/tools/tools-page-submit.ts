import type { Dispatch, FormEvent, SetStateAction } from 'react';

export function handleToolsSubmit(
  setPage: Dispatch<SetStateAction<number>>,
  event: FormEvent<HTMLFormElement>,
) {
  event.preventDefault();
  setPage(1);
}
