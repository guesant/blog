'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { Reference, ReferenceCollection, Writing } from '@portfolio/content/types';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { toMessageKey } from '../../content/achados';
import { NavLink } from '../primitives/nav-link';

type FeedKind = 'post' | 'achado' | 'colecao';
type SortMode = 'desc' | 'asc' | 'alpha' | 'popular';

type FeedEntry = {
  kind: FeedKind;
  slug: string;
  title: string;
  preview: string;
  date: string;
  readingTime?: string;
  topics: string[];
  findingType?: string;
  popularityRank?: number;
  featured?: boolean;
  href: string;
};

type FeedPageCopy = { eyebrow?: string; title: string; description: string };

type ContentFeedProps = {
  writings: Writing[];
  findings: Reference[];
  collections: ReferenceCollection[];
  copy: FeedPageCopy;
  fixedKind?: FeedKind;
  action: string;
  initialKind?: string;
  initialTopic?: string;
  initialSearch?: string;
  initialSort?: SortMode;
  initialPage?: number;
};

const PAGE_SIZE = 20;

function dateValue(value?: string): string {
  return value || '';
}

function formatDate(value: string, locale: string): string | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return undefined;
  }
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function buildEntries(
  writings: Writing[],
  findings: Reference[],
  collections: ReferenceCollection[],
): FeedEntry[] {
  return [
    ...writings.map((item) => ({
      kind: 'post' as const,
      slug: item.slug,
      title: item.title,
      preview: item.excerpt,
      date: dateValue(item.dateISO),
      readingTime: item.readingTime,
      topics: item.tags,
      href: `/writing/${item.slug}`,
    })),
    ...findings.map((item) => ({
      kind: 'achado' as const,
      slug: item.slug,
      title: item.title,
      preview: item.personalNote || item.reasonFound || item.description,
      date: dateValue(item.foundDateISO || item.publishedDateISO),
      topics: item.topics,
      findingType: item.type,
      popularityRank: item.rating === 'not-rated' ? undefined : 1,
      href: `/findings/${item.slug}`,
    })),
    ...collections.map((item) => ({
      kind: 'colecao' as const,
      slug: item.slug,
      title: item.title,
      preview: item.description,
      date: '',
      topics: [],
      href: `/collections/${item.slug}`,
    })),
  ].sort((left, right) => {
    const dateOrder = right.date.localeCompare(left.date);
    return dateOrder || left.title.localeCompare(right.title);
  });
}

function entryMatchesSearch(entry: FeedEntry, search: string): boolean {
  if (!search.trim()) {
    return true;
  }
  const needle = search.trim().toLocaleLowerCase();
  return `${entry.title} ${entry.preview}`.toLocaleLowerCase().includes(needle);
}

function FeedCard(props: { entry: FeedEntry; locale: string; t: (key: string) => string }) {
  const { entry, locale, t } = props;
  const date = formatDate(entry.date, locale);
  const kindLabel = t(
    entry.kind === 'post' ? 'writing' : entry.kind === 'achado' ? 'finding' : 'collection',
  );

  return (
    <Card
      component={NavLink}
      href={entry.href}
      underline="none"
      color="inherit"
      sx={{
        minHeight: '15rem',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        borderColor: 'divider',
        '&:hover .content-feed-title': { color: 'secondary.main' },
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant="overline" color="secondary">
          {kindLabel}
        </Typography>
        {date && <Typography variant="overline" color="text.disabled">· {date}</Typography>}
      </Stack>
      <Typography
        className="content-feed-title"
        component="h2"
        variant="h3"
        sx={{ mt: 1, fontSize: '1.15rem', transition: 'color .2s' }}
      >
        {entry.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.25, fontSize: '.9rem' }}>
        {entry.preview}
      </Typography>
      <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
        {entry.findingType && (
          <Chip label={t(`types.${toMessageKey(entry.findingType)}`)} size="small" />
        )}
        {entry.featured && <Chip label={t('featured')} size="small" color="info" />}
        {entry.topics.slice(0, 4).map((topic) => (
          <Chip key={topic} label={topic} size="small" variant="outlined" />
        ))}
      </Box>
    </Card>
  );
}

export function ContentFeed(props: ContentFeedProps) {
  const {
    writings,
    findings,
    collections,
    copy,
    fixedKind,
    action,
    initialKind = 'all',
    initialTopic = '',
    initialSearch = '',
    initialSort = 'desc',
    initialPage = 1,
  } = props;
  const locale = useLocale();
  const router = useRouter();
  const tNav = useTranslations('Nav');
  const tPages = useTranslations('Pages.achados');
  const [kind, setKind] = useState(fixedKind || initialKind);
  const [topic, setTopic] = useState(initialTopic);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<SortMode>(initialSort);
  const [pendingSearch, setPendingSearch] = useState(initialSearch);
  const entries = useMemo(
    () => buildEntries(writings, findings, collections),
    [writings, findings, collections],
  );
  const topics = useMemo(
    () => [...new Set(entries.flatMap((entry) => entry.topics))].sort((left, right) => left.localeCompare(right)),
    [entries],
  );
  const filteredEntries = useMemo(() => {
    const filtered = entries.filter((entry) => {
      const matchesKind = fixedKind ? entry.kind === fixedKind : kind === 'all' || entry.kind === kind;
      const matchesTopic = !topic || entry.topics.includes(topic);
      return matchesKind && matchesTopic && entryMatchesSearch(entry, search);
    });
    return [...filtered].sort((left, right) => {
      if (sort === 'alpha') {
        return left.title.localeCompare(right.title);
      }
      if (sort === 'asc') {
        return left.date.localeCompare(right.date) || left.title.localeCompare(right.title);
      }
      if (sort === 'popular') {
        return (right.popularityRank || 0) - (left.popularityRank || 0);
      }
      return right.date.localeCompare(left.date) || left.title.localeCompare(right.title);
    });
  }, [entries, fixedKind, kind, topic, search, sort]);
  const pageCount = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const page = Math.min(Math.max(initialPage, 1), pageCount);
  const visibleEntries = filteredEntries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (!fixedKind && kind !== 'all') params.set('kind', kind);
    if (topic) params.set('topic', topic);
    if (pendingSearch.trim()) params.set('q', pendingSearch.trim());
    if (sort !== 'desc') params.set('sort', sort);
    router.push(`${action}${params.size ? `?${params.toString()}` : ''}`);
    setSearch(pendingSearch.trim());
  }

  return (
    <Box component="section" sx={{ width: '100%', py: { xs: 8, md: 10 } }}>
      <Box component="header" sx={{ maxWidth: '46rem', mb: { xs: 5, md: 7 } }}>
        {copy.eyebrow && (
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            {copy.eyebrow}
          </Typography>
        )}
        <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3rem' }, maxWidth: '20ch' }}>
          {copy.title}
        </Typography>
        {copy.description && (
          <Typography color="text.secondary" sx={{ maxWidth: '60ch', mt: 2 }}>
            {copy.description}
          </Typography>
        )}
      </Box>
      <Box component="form" onSubmit={applyFilters} sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          {!fixedKind && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{tNav('content')}</InputLabel>
              <Select value={kind} label={tNav('content')} onChange={(event) => setKind(event.target.value)}>
                <MenuItem value="all">{tNav('content')}</MenuItem>
                <MenuItem value="post">{tNav('writing')}</MenuItem>
                <MenuItem value="achado">{tNav('achados')}</MenuItem>
                <MenuItem value="colecao">{tNav('collections')}</MenuItem>
              </Select>
            </FormControl>
          )}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{tPages('topicFilterLabel')}</InputLabel>
            <Select value={topic} label={tPages('topicFilterLabel')} onChange={(event) => setTopic(event.target.value)}>
              <MenuItem value="">{tNav('topics')}</MenuItem>
              {topics.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{tPages('sortBy')}</InputLabel>
            <Select value={sort} label={tPages('sortBy')} onChange={(event) => setSort(event.target.value as SortMode)}>
              <MenuItem value="desc">{tPages('newest')}</MenuItem>
              <MenuItem value="asc">{tPages('oldest')}</MenuItem>
              <MenuItem value="alpha">{tPages('alphabetical')}</MenuItem>
              <MenuItem value="popular">{tPages('mostPopular')}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label={tPages('searchPlaceholder')}
            value={pendingSearch}
            onChange={(event) => setPendingSearch(event.target.value)}
            sx={{ minWidth: { md: 260 } }}
          />
          <Button type="submit" variant="contained">{tPages('apply')}</Button>
          <Button href={action}>{tPages('clearFilters')}</Button>
        </Stack>
      </Box>
      {visibleEntries.length === 0 ? (
        <Typography color="text.secondary">{tPages('noResults')}</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
          {visibleEntries.map((entry) => <FeedCard key={`${entry.kind}-${entry.slug}`} entry={entry} locale={locale} t={tPages} />)}
        </Box>
      )}
      {pageCount > 1 && (
        <Stack direction="row" spacing={1} sx={{ mt: 4, justifyContent: 'center' }}>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((value) => (
            <Button key={value} href={`${action}?page=${value}`} variant={value === page ? 'contained' : 'outlined'}>
              {value}
            </Button>
          ))}
        </Stack>
      )}
    </Box>
  );
}
