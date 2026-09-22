import { getLocalizedPage } from '../api/public-site-source.ts';
import { normalizeLocale } from '../api/public-site-source-normalize-locale';
import { getMessages } from '../../i18n/messages';
import { translator } from '../../i18n/compat-translator';
import type { NowPageCopy } from '../domain/types.ts';

type NowPageApiEntry = {
  key: string;
  value: string;
};

type NowPageApi = Omit<NowPageCopy, 'entries'> & { entries: NowPageApiEntry[] };

const nowEntryMessageKeys: Record<string, string> = {
  trabalhando: 'working',
  construindo: 'building',
  estudando: 'studying',
  lendo: 'reading',
  ouvindo: 'listening',
  assistindo: 'watching',
};

export async function getNowPageCopy(locale?: string) {
  const page = await getLocalizedPage<NowPageApi>('now', locale);

  const t = translator(getMessages(normalizeLocale(locale)), 'Pages.now');

  return {
    ...page,
    entries: page.entries.map((entry) => ({
      ...entry,
      label: t(nowEntryMessageKeys[entry.key] ?? entry.key),
    })),
  } satisfies NowPageCopy;
}
