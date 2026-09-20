import type { FormEvent } from 'react';

export function submitPasswordGenerator(onGenerate: () => void, event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  onGenerate();
}
