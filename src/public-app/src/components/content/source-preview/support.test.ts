import assert from 'node:assert/strict';
import test from 'node:test';
import type { Reference } from '@portfolio/data/domain/types';
import { sourcePreviewDataForLink } from './source-preview-data-for-link';

const finding: Reference = {
  order: 1,
  slug: 'example-finding',
  type: 'repo',
  title: 'Example finding',
  description: 'An example finding.',
  consumptionState: 'unread',
  rating: 'neutral',
  editorialState: 'published',
  visibility: 'public',
  topics: [],
  links: [],
  identifiers: [],
  relations: [],
  repo: {
    org: 'guesant',
    name: 'portfolio',
    language: 'TypeScript',
  },
};

test('creates one preview for every recognized finding link', () => {
  const links = [
    { url: 'https://github.com/guesant/portfolio' },
    { url: 'https://www.youtube.com/watch?v=example-video' },
    { url: 'https://example.com/article' },
  ];

  const previews = links.flatMap((link) => {
    const preview = sourcePreviewDataForLink(finding, link);

    return preview ? [preview] : [];
  });

  assert.equal(previews.length, 3);
  assert.deepEqual(
    previews.map((preview) => [preview.provider, preview.kind]),
    [
      ['github', 'repository'],
      ['youtube', 'video'],
      ['generic', 'link'],
    ],
  );
});

test('recognizes channel, playlist, organization, and user links', () => {
  const cases = [
    ['https://github.com/orgs/open-policy-agent', 'organization'],
    ['https://github.com/open-policy-agent', 'user'],
    ['https://www.youtube.com/playlist?list=PLexample', 'playlist'],
    ['https://www.youtube.com/@example', 'channel'],
  ] as const;

  for (const [url, kind] of cases) {
    const preview = sourcePreviewDataForLink(finding, { url });

    assert.equal(preview?.kind, kind);
  }
});

test('creates a generic widget for valid provider links without a specialized parser', () => {
  const urls = ['https://github.com/', 'https://www.youtube.com/shorts/example-video'];

  for (const url of urls) {
    const preview = sourcePreviewDataForLink(finding, { url });

    assert.equal(preview?.provider, 'generic');
    assert.equal(preview?.kind, 'link');
  }
});

test('exposes generic Open Graph metadata alongside the host', () => {
  const preview = sourcePreviewDataForLink(finding, {
    url: 'https://example.com/article',
    openGraph: {
      siteName: 'Example',
      type: 'article',
      title: 'Article',
    },
  });

  assert.deepEqual(preview?.metadata, [
    { key: 'host', value: 'example.com' },
    { key: 'siteName', value: 'Example' },
    { key: 'contentType', value: 'article' },
  ]);
});
