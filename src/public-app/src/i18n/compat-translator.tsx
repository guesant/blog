import type { InterfaceMessages } from '@portfolio/data/domain/types';
import { Translator } from './compat-support';
import { lookup } from './compat-lookup';

export function translator(messages: InterfaceMessages, namespace?: string): Translator {
  return (key, values) => {
    const result = lookup(messages, namespace ? `${namespace}.${key}` : key);

    if (typeof result !== 'string') return key;
    return values
      ? Object.entries(values).reduce(
          (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
          result,
        )
      : result;
  };
}
