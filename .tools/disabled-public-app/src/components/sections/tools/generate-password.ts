import type { Dispatch, SetStateAction } from 'react';
import { createPassword } from './create-password';
import type { CharacterSet, PasswordResult } from './password-generator-types';

type GeneratePasswordOptions = {
  length: number;
  enabled: Record<CharacterSet, boolean>;
  setResult: Dispatch<SetStateAction<PasswordResult>>;
  setCopied: Dispatch<SetStateAction<boolean>>;
};

export function generatePassword(options: GeneratePasswordOptions) {
  options.setResult(createPassword(options.length, options.enabled));
  options.setCopied(false);
}
