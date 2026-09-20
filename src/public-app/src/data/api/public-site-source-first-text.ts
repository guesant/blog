import { textValue } from './public-site-source-text-value';

export function firstText(...values: unknown[]): string {
  for (const value of values) {
    const text = textValue(value);

    if (text) {
      return text;
    }
  }
  return '';
}
