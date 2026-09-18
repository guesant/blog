import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { createContentRuntime } from '../src/runtime.ts';

const contentRoot = path.resolve('test/fixtures/content/cms');
const runtime = createContentRuntime(contentRoot);

test('reads the PDF content without the Tina adapter', async () => {
  const [english, portuguese] = await Promise.all([
    runtime.getResumePageContent('en'),
    runtime.getResumePageContent('pt-BR'),
  ]);

  assert.equal(english.profile.name, 'Gabriel Antunes');
  assert.equal(portuguese.profile.title, 'Desenvolvedor de soluções');
  assert.equal(english.page.title, 'Résumé');
  assert.equal(portuguese.page.title, 'Currículo');
  assert.equal(english.cases.length, 3);
  assert.equal(english.cases[0]?.title, 'Central de Vagas em Creches');
  assert.ok(english.resume.skills.every((group) => group.items.length > 0));
  assert.deepEqual(english.resume.languages, [
    { code: 'pt-BR', name: 'Portuguese (Brazil)', proficiency: 'native' },
    { code: 'en', name: 'English' },
  ]);
});

test('reads the contact email without creating the protected-email npm graph', async () => {
  const [email, page] = await Promise.all([
    runtime.getContactEmail(),
    runtime.getResumePageContent('en'),
  ]);

  assert.equal(email, 'gabrielrodantunes@gmail.com');
  assert.equal(page.site.contact.hasEmail, true);
  assert.equal(page.site.contact.profiles.length, 6);
  assert.equal('emailChallenge' in page.site.contact, false);
});
