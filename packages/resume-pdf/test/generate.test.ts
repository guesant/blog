import assert from 'node:assert/strict';
import test from 'node:test';
import { buildLanguagesSection } from '../src/generate.mts';

test('renders native and CEFR proficiencies while omitting an unstated level', () => {
  const section = buildLanguagesSection(
    [
      { code: 'pt-BR', name: 'Portuguese (Brazil)', proficiency: 'native' },
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'French', proficiency: 'B2' },
    ],
    { languagesHeading: 'Languages', nativeProficiency: 'Native' },
  );

  assert.match(section, /\\item Portuguese \(Brazil\) \(Native\)/);
  assert.match(section, /\\item English\n/);
  assert.doesNotMatch(section, /English \(/);
  assert.match(section, /\\item French \(B2\)/);
});
