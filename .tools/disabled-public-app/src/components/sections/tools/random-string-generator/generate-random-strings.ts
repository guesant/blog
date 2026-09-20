import type { Dispatch, SetStateAction } from 'react';
import { createStrings } from './create-strings';
import type { CharacterSet } from './types';

type GenerateRandomStringsOptions = {
  length: number;
  count: number;
  enabled: Record<CharacterSet, boolean>;
  setResults: Dispatch<SetStateAction<string[]>>;
};

export function generateRandomStrings(options: GenerateRandomStringsOptions) {
  options.setResults(createStrings(options.length, options.count, options.enabled));
}
