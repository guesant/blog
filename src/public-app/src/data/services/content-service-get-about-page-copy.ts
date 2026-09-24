import { getLocalizedPage } from '../api/public-site-source.ts';
import type { AboutPageCopy } from '../domain/types.ts';
import { createAboutEditorialSections } from './create-about-editorial-sections';
import { createRichTextContent } from './create-rich-text-content';

export async function getAboutPageCopy(locale?: string): Promise<AboutPageCopy> {
  const page = await getLocalizedPage<AboutPageCopy>('about', locale);

  return {
    ...page,
    introduction:
      page.introduction ?? createRichTextContent([page.lead, page.context, page.description]),
    sections: page.sections ?? createAboutEditorialSections(page),
  };
}
