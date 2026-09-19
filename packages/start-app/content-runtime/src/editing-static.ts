'use client';

import type { EditableContent } from './domain/types.ts';

type EditableStaticContent<T extends object> = T & EditableContent;

type ContentFields = Record<string, unknown>;

export function getEditableProps(_source?: unknown, _field?: string | string[]): Record<string, never> {
  return {};
}

export function useEditableContent<T extends object>(staticContent: EditableStaticContent<T>) {
  const fields = { ...staticContent } as ContentFields;
  return { content: staticContent, source: fields, raw: fields };
}

export { ContentRichText } from './adapters/filesystem/rich-text.tsx';
