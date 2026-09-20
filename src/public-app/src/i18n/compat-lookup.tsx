import { Message } from './compat-support';

export function lookup(value: Message | undefined, path: string): Message | undefined {
  return path.split('.').reduce<Message | undefined>((current, segment) => {
    if (!current || typeof current === 'string') return undefined;
    return current[segment];
  }, value);
}
