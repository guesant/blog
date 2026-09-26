import type { TypeSpecificFieldDefinition } from './type-specific-fields';

export const bookFieldDefinitions: readonly TypeSpecificFieldDefinition[] = [
  ['publisher', (reference) => reference.book?.publisher],
  ['edition', (reference) => reference.book?.edition],
  ['pages', (reference) => reference.book?.pages],
  ['isbn', (reference) => reference.book?.isbn],
];

export const paperFieldDefinitions: readonly TypeSpecificFieldDefinition[] = [
  ['journal', (reference) => reference.paper?.journal],
  ['conference', (reference) => reference.paper?.conference],
  ['year', (reference) => reference.paper?.year],
  ['doi', (reference) => reference.paper?.doi],
];
