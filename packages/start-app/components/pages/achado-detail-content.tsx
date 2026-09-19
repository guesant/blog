'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { ExternalLink as ExternalLinkData, Reference } from '@portfolio/content/types';
import { useLocale, useTranslations } from '@/i18n/compat';
import { toMessageKey } from '../../content/achados';
import { ConnectionsSection } from '../content/connections-section';
import { DetailHeader } from '../content/page-header';
import { TopicChip } from '../content/topic-chip';
import { ExternalLink } from '../primitives/external-link';
import type { IconName } from '../primitives/icon';
import { LayoutStack as Stack } from '../primitives/layout-stack';

type AchadoDetailContentProps = { item: Reference };

const LINK_PURPOSE_ICONS: Record<string, IconName> = {
  'official-source': 'globe',
  reading: 'book-open',
  viewing: 'play-circle',
  purchase: 'shopping-cart',
  download: 'download',
  documentation: 'book-open',
  repository: 'folder-git',
  demo: 'play-circle',
  translation: 'languages',
  'archived-version': 'archive',
  review: 'star',
  discussion: 'messages-square',
  'author-page': 'user',
  'publisher-page': 'building',
  other: 'more-horizontal',
};

function linkIcon(link: ExternalLinkData): IconName {
  if (/\.pdf($|[?#])/i.test(link.url)) {
    return 'document';
  }
  return (link.purpose && LINK_PURPOSE_ICONS[link.purpose]) || 'external';
}

function joinDefined(parts: (string | undefined)[]) {
  return parts.filter((part) => part && part.length > 0).join(' · ');
}

type DetailEntry = { label: string; value: string };

function pushEntry(entries: DetailEntry[], label: string, value: string | number | undefined) {
  if (value === undefined || value === '') {
    return;
  }
  entries.push({ label, value: String(value) });
}

function typeSpecificEntries(
  item: Reference,
  tFields: ReturnType<typeof useTranslations>,
): DetailEntry[] {
  const entries: DetailEntry[] = [];
  const { book, paper, repo, video, film } = item;

  if (book) {
    pushEntry(entries, tFields('publisher'), book.publisher);
    pushEntry(entries, tFields('edition'), book.edition);
    pushEntry(entries, tFields('pages'), book.pages);
    pushEntry(entries, tFields('isbn'), book.isbn);
  }
  if (paper) {
    pushEntry(entries, tFields('journal'), paper.journal);
    pushEntry(entries, tFields('conference'), paper.conference);
    pushEntry(entries, tFields('year'), paper.year);
    pushEntry(entries, tFields('doi'), paper.doi);
  }
  if (repo) {
    pushEntry(entries, tFields('repoName'), [repo.org, repo.name].filter(Boolean).join('/'));
    pushEntry(entries, tFields('programmingLanguage'), repo.language);
    pushEntry(entries, tFields('license'), repo.license);
  }
  if (video) {
    pushEntry(entries, tFields('channel'), video.channel);
    pushEntry(entries, tFields('duration'), video.duration);
  }
  if (film) {
    pushEntry(entries, tFields('director'), film.director);
    pushEntry(entries, tFields('year'), film.year);
    pushEntry(entries, tFields('duration'), film.duration);
  }

  return entries;
}

export function AchadoDetailContent(props: AchadoDetailContentProps) {
  const { item: staticItem } = props;
  const locale = useLocale();
  const t = useTranslations('Pages.achados');
  const tFields = useTranslations('Pages.achados.fields');
  const tNav = useTranslations('Nav');
  const { content: item, source } = useEditableContent(staticItem);

  const formattedPublishedDate = item.publishedDateISO
    ? new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        timeZone: 'UTC',
      }).format(new Date(item.publishedDateISO))
    : undefined;

  const details = typeSpecificEntries(item, tFields);
  const showRating = item.rating !== 'not-rated';

  return (
    <Box component="article" sx={{ py: { xs: 8, md: 10 }, maxWidth: '48rem', mx: 'auto' }}>
      <DetailHeader
        backHref="/findings"
        backLabel={t('back')}
        breadcrumbs={[{ label: tNav('achados'), href: '/findings' }, { label: item.title }]}
        eyebrow={joinDefined([
          t(`types.${toMessageKey(item.type)}`),
          showRating ? t(`ratings.${toMessageKey(item.rating)}`) : undefined,
        ])}
        title={item.title}
        description={item.description}
        meta={joinDefined([item.authors, item.organizations, formattedPublishedDate])}
        editableProps={{
          title: getEditableProps(source, 'title'),
          description: getEditableProps(source, 'description'),
        }}
      />

      {item.topics.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            {t('topicsHeading')}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            {item.topics.map((topic, index) => (
              <TopicChip key={topic} name={topic} slug={item.topicSlugs?.[index] ?? ''} />
            ))}
          </Stack>
        </Box>
      )}

      {details.length > 0 && (
        <Box sx={{ mt: 5, pt: 5, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            {t('detailsHeading')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              rowGap: 1.5,
              columnGap: 3,
            }}
          >
            {details.map((entry) => (
              <Box key={entry.label}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {entry.label}
                </Typography>
                <Typography variant="body2">{entry.value}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {item.links.length > 0 && (
        <Box sx={{ mt: 5, pt: 5, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            {t('linksHeading')}
          </Typography>
          <Stack gap={1.5}>
            {item.links.map((link) => (
              <ExternalLink
                key={link.url}
                href={link.url}
                underline="hover"
                color="inherit"
                leadingIcon={linkIcon(link)}
              >
                {link.label || link.url}
              </ExternalLink>
            ))}
          </Stack>
        </Box>
      )}

      <ConnectionsSection relations={item.relations} />
    </Box>
  );
}
