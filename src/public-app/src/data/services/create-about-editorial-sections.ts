import type { AboutEditorialSection, AboutPageCopy } from '../domain/types';

export function createAboutEditorialSections(page: AboutPageCopy): AboutEditorialSection[] {
  if (!page.story) {
    return [];
  }

  return [
    {
      id: 'story',
      body: page.story,
    },
  ];
}
