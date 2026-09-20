import { useEffect, useState } from 'react';
import { generateRandomStrings } from './generate-random-strings';
import { readRandomStringQuery } from './read-random-string-query';
import type { CharacterSet } from './types';

const defaultEnabled: Record<CharacterSet, boolean> = {
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: false,
};

export function useRandomStringState() {
  const [length, setLength] = useState(12);

  const [count, setCount] = useState(1);

  const [enabled, setEnabled] = useState<Record<CharacterSet, boolean>>(defaultEnabled);

  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const next = readRandomStringQuery();

    setLength(next.length);
    setCount(next.count);
    setEnabled(next.enabled);
    generateRandomStrings({
      length: next.length,
      count: next.count,
      enabled: next.enabled,
      setResults,
    });
  }, []);

  const onGenerate = generateRandomStrings.bind(null, { length, count, enabled, setResults });

  return { count, enabled, length, onGenerate, results, setCount, setEnabled, setLength };
}
