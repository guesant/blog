import { getMessages } from '../../i18n/messages';
import { lookup } from '../../i18n/compat-lookup';
import type { PageIntroduction } from '../domain/types.ts';

export async function getCollectionsPageCopy(locale?: string): Promise<PageIntroduction> {
  const messages = getMessages(locale === 'pt-BR' ? 'pt-BR' : 'en');

  const page = lookup(messages, 'Pages.collections') as Record<string, string>;

  return {
    eyebrow: page.eyebrow,
    title: page.indexTitle,
    description: page.indexDescription,
  };
}
