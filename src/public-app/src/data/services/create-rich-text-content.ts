import type { RichTextContent } from '../domain/types';

export function createRichTextContent(paragraphs: Array<string | undefined>): RichTextContent {
  return {
    children: paragraphs
      .filter((paragraph): paragraph is string => Boolean(paragraph?.trim()))
      .map((paragraph) => ({
        type: 'p',
        children: [{ type: 'text', text: paragraph }],
      })),
  };
}
