import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { searchIndexFields, searchIndexStoreFields } from '../src/generate.mts';

const clientSource = readFileSync(
  fileURLToPath(
    new URL('../../start-app/components/content/search-and-filter-bar.tsx', import.meta.url),
  ),
  'utf8',
);

function declaredArray(name: string): string[] {
  const body = clientSource.match(new RegExp(`const ${name} = \\[([^\\]]*)\\]`, 'u'))?.[1];
  assert.ok(body, `${name} is not declared in search-and-filter-bar.tsx`);
  return [...body.matchAll(/'([^']+)'/gu)].map((match) => match[1]);
}

test('the client re-declares the searchable fields verbatim', () => {
  assert.deepEqual(declaredArray('SEARCH_INDEX_FIELDS'), searchIndexFields);
});

test('the client re-declares the stored fields verbatim', () => {
  assert.deepEqual(declaredArray('SEARCH_INDEX_STORE_FIELDS'), searchIndexStoreFields);
});
