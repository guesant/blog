import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeLocale,
  withContentDefaults,
  withoutHiddenItems,
} from '../src/adapters/filesystem/filesystem-source.ts';
import {
  getCaseBySlug,
  getCases,
  getHomePageContent,
  getLatestNotes,
  getProfile,
  getReferenceBySlug,
  getReferenceCollectionBySlug,
  getReferenceCollections,
  getReferences,
  getReferencesByTopic,
  getResume,
  getResumePageContent,
  getSiteText,
  getTopicBySlug,
  getTopics,
  getWritingBySlug,
} from '../src/server.ts';

test('normalizes locales and returns localized content', async () => {
  assert.equal(normalizeLocale(), 'en');
  assert.equal(normalizeLocale('pt-BR'), 'pt-BR');
  assert.equal(normalizeLocale('pt'), 'en');

  const [english, portuguese] = await Promise.all([getCases('en'), getCases('pt-BR')]);
  assert.ok(english.length > 0);
  assert.equal(english.length, portuguese.length);
  assert.ok(portuguese.every((item) => item.title.length > 0));
});

test('filters hidden content and initializes missing arrays', () => {
  const content = withoutHiddenItems({
    visible: [{ label: 'kept' }, { hidden: true, label: 'removed' }],
    nested: { values: [{ hidden: true }, { label: 'kept' }] },
  });
  assert.deepEqual(content, {
    visible: [{ label: 'kept' }],
    nested: { values: [{ label: 'kept' }] },
  });
  assert.deepEqual(
    withContentDefaults({ title: 'Example' }, ['metrics', 'technologies', 'personalInterests']),
    {
      title: 'Example',
      metrics: [],
      technologies: [],
      personalInterests: [],
    },
  );
});

test('validates slugs and handles missing documents', async () => {
  assert.equal(await getCaseBySlug('../site'), undefined);
  assert.equal(await getCaseBySlug('does-not-exist'), undefined);
});

test('orders documents and resolves references', async () => {
  const cases = await getCases('en');
  assert.deepEqual(
    cases.map((item) => item.order),
    [...cases.map((item) => item.order)].sort((left, right) => left - right),
  );
  assert.ok(cases.every((item) => item.technologies.every((technology) => technology.length > 0)));

  const caseStudy = cases[0];
  const writing = await getWritingBySlug('rrule', 'pt-BR');
  assert.ok(writing?.type);
  assert.ok(writing?.subject);
  assert.ok(writing?.tags.every((tag) => tag.length > 0));
});

test('preserves CMS-selected home and resume references', async () => {
  const [home, resume, notes, site] = await Promise.all([
    getHomePageContent('en'),
    getResumePageContent('en'),
    getLatestNotes('en'),
    getSiteText('en'),
  ]);

  type ContentReference = string | { item: string };
  const referenceSlug = (reference: ContentReference) =>
    (typeof reference === 'string' ? reference : reference.item)
      .split('/')
      .at(-1)
      ?.replace(/\.json$/, '');
  assert.ok(
    home.cases.every((item) =>
      home.page.featuredCases.some((reference) => referenceSlug(reference) === item.slug),
    ),
  );
  assert.ok(
    resume.cases.every((item) =>
      resume.resume.selectedCases.some((reference) => referenceSlug(reference) === item.slug),
    ),
  );
  assert.deepEqual(
    notes.map((note) => note.dateISO),
    [...notes.map((note) => note.dateISO)].sort((left, right) => right.localeCompare(left)),
  );
  assert.ok(Array.isArray(site.contact.profiles));
  assert.equal(typeof site.contact.hasEmail, 'boolean');
  assert.equal(site.portfolioUrl, undefined);
});

test('resolves profile interests and language proficiencies without fabricating CEFR levels', async () => {
  const [englishProfile, portugueseProfile, englishResume, portugueseResume, site] =
    await Promise.all([
      getProfile('en'),
      getProfile('pt-BR'),
      getResume('en'),
      getResume('pt-BR'),
      getSiteText('en'),
    ]);

  assert.deepEqual(englishProfile.personalInterests, [
    'Coffee and code.',
    'Geopolitics, music and films.',
    'Learning how computing and science work internally and how to build things independently.',
  ]);
  assert.deepEqual(portugueseProfile.personalInterests, [
    'Café e código.',
    'Geopolítica, música e filmes.',
    'Aprender como a computação e a ciência funcionam por dentro e como construir coisas de forma independente.',
  ]);
  assert.equal(englishProfile.birthCity, 'Ji-Paraná, Rondônia, Brazil');
  assert.equal(portugueseProfile.birthCity, 'Ji-Paraná, Rondônia, Brasil');

  assert.deepEqual(englishResume.languages, [
    { code: 'pt-BR', name: 'Portuguese (Brazil)', proficiency: 'native' },
    { code: 'en', name: 'English' },
  ]);
  assert.deepEqual(portugueseResume.languages, [
    { code: 'pt-BR', name: 'Português (Brasil)', proficiency: 'native' },
    { code: 'en', name: 'Inglês' },
  ]);
  assert.equal(englishResume.languages[1]?.proficiency, undefined);
  assert.ok(englishResume.skills.every((group) => group.items.length > 0));
  assert.deepEqual(
    site.contact.profiles.map((profile) => profile.platform),
    ['linkedin', 'github', 'lattes', 'orcid', 'instagram', 'gitlab'],
  );
});

test('resolves references, topics, and links', async () => {
  const references = await getReferences('en');
  assert.equal(references.length, 5);
  assert.deepEqual(
    references.map((reference) => reference.order),
    [...references.map((reference) => reference.order)].sort((left, right) => left - right),
  );

  const ddia = references.find((reference) => reference.slug === 'ddia');
  assert.ok(ddia);
  assert.deepEqual(ddia?.topics, ['Distributed systems', 'Software architecture']);
  assert.equal(ddia?.language, 'English');
  assert.equal(ddia?.links[0]?.url, 'https://dataintensive.net/');
  assert.equal(ddia?.identifiers[0]?.kind, 'isbn');
});

test('resolves outbound and inbound relations, including symmetric ones', async () => {
  const raftPaper = await getReferenceBySlug('raft-paper', 'en');
  assert.ok(raftPaper);
  assert.equal(raftPaper?.relations.length, 3);
  assert.ok(raftPaper?.relations.every((relation) => relation.direction === 'inbound'));
  assert.deepEqual(
    raftPaper?.relations.map((relation) => relation.label).sort(),
    ['is cited by', 'is explained by', 'is implemented by'].sort(),
  );

  const ddia = await getReferenceBySlug('ddia', 'en');
  assert.ok(ddia);
  const outbound = ddia?.relations.find((relation) => relation.direction === 'outbound');
  assert.equal(outbound?.relationType, 'cites');
  assert.equal(outbound?.label, 'cites');
  assert.equal(outbound?.targetSlug, 'raft-paper');
  assert.ok(outbound?.targetTitle.length);

  const inboundSymmetric = ddia?.relations.find((relation) => relation.direction === 'inbound');
  assert.equal(inboundSymmetric?.relationType, 'relates-to');
  assert.equal(inboundSymmetric?.label, 'relates to');
  assert.equal(inboundSymmetric?.targetSlug, 'consistency-models-article');

  const article = await getReferenceBySlug('consistency-models-article', 'en');
  const articleOutbound = article?.relations.find((relation) => relation.direction === 'outbound');
  assert.equal(articleOutbound?.label, inboundSymmetric?.label);

  const raftPaperPtBR = await getReferenceBySlug('raft-paper', 'pt-BR');
  assert.deepEqual(
    raftPaperPtBR?.relations.map((relation) => relation.label).sort(),
    ['é citado por', 'é explicado por', 'é implementado por'].sort(),
  );
});

test('filters references by topic and resolves collection items with notes', async () => {
  const topic = await getTopicBySlug('consensus', 'en');
  assert.equal(topic?.name, 'Consensus algorithms');

  const byTopic = await getReferencesByTopic('consensus', 'en');
  assert.deepEqual(
    byTopic.map((reference) => reference.slug).sort(),
    ['etcd', 'raft-paper', 'raft-refresher'].sort(),
  );

  const topics = await getTopics('en');
  assert.ok(topics.some((item) => item.slug === 'distributed-systems'));

  const collections = await getReferenceCollections('en');
  assert.ok(
    collections.some((collection) => collection.slug === 'distributed-systems-starter-kit'),
  );

  const collection = await getReferenceCollectionBySlug('distributed-systems-starter-kit', 'en');
  assert.ok(collection);
  assert.equal(collection?.items.length, 4);
  assert.deepEqual(
    collection?.items.map((item) => item.reference.slug),
    ['raft-paper', 'raft-refresher', 'etcd', 'ddia'],
  );
  assert.equal(collection?.items[0]?.note, 'Start with the primary source before anything else.');

  assert.equal(await getReferenceBySlug('does-not-exist', 'en'), undefined);
  assert.equal(await getReferenceCollectionBySlug('does-not-exist', 'en'), undefined);
});

test('excludes non-public references from every public read path', async () => {
  const references = await getReferences('en');
  assert.ok(!references.some((reference) => reference.slug === 'private-notes-draft'));
  assert.equal(await getReferenceBySlug('private-notes-draft', 'en'), undefined);
});

test('excludes relations that point at or come from a non-public reference', async () => {
  const ddia = await getReferenceBySlug('ddia', 'en');
  assert.ok(ddia);
  assert.equal(ddia?.relations.length, 2);
  assert.ok(!ddia?.relations.some((relation) => relation.targetSlug === 'private-notes-draft'));

  const raftPaper = await getReferenceBySlug('raft-paper', 'en');
  assert.ok(raftPaper);
  assert.equal(raftPaper?.relations.length, 3);
  assert.ok(
    !raftPaper?.relations.some((relation) => relation.targetSlug === 'private-notes-draft'),
  );
});
