import { useEffect, useState } from 'react';
import { copyPassword } from './copy-password';
import { createPassword } from './create-password';
import { generatePassword } from './generate-password';
import { readPasswordGeneratorQuery } from './read-password-generator-query';
import type { CharacterSet, PasswordResult } from './password-generator-types';

const defaultEnabled: Record<CharacterSet, boolean> = {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
};

export function usePasswordGeneratorState() {
  const [length, setLength] = useState(16);

  const [enabled, setEnabled] = useState<Record<CharacterSet, boolean>>(
    defaultEnabled,
  );

  const [result, setResult] = useState<PasswordResult>(() => createPassword(length, enabled));

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const next = readPasswordGeneratorQuery();

    setLength(next.length);
    setEnabled(next.enabled);
    setResult(createPassword(next.length, next.enabled));
  }, []);

  const onGenerate = generatePassword.bind(null, { length, enabled, setResult, setCopied });

  const onCopy = () => void copyPassword(result.value, setCopied);

  return { copied, enabled, length, onCopy, onGenerate, result, setEnabled, setLength };
}
