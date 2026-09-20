import type { FormEvent } from 'react';

export function submitRandomStringGenerator(
  onGenerate: () => void,
  event: FormEvent<HTMLFormElement>,
) {
  event.preventDefault();
  onGenerate();
}
