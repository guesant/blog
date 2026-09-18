'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { Reference } from '@portfolio/content/types';
import MiniSearch from 'minisearch';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { toMessageKey } from '../../content/achados';
import { Icon, type IconName } from '../primitives/icon';

const TYPE_ICONS: Record<string, IconName> = {
  book: 'book',
  article: 'newspaper',
  paper: 'scroll-text',
  repo: 'folder-git',
  site: 'globe',
  docs: 'book-open',
  tool: 'wrench',
  course: 'graduation-cap',
  video: 'video',
  playlist: 'list-video',
  channel: 'tv',
  podcast: 'podcast',
  film: 'clapperboard',
  other: 'more-horizontal',
};

const RATING_ICONS: Record<string, IconName> = {
  'not-rated': 'circle-dashed',
  interesting: 'star',
  recommended: 'star',
  'strongly-recommended': 'sparkles',
  'not-recommended': 'star-off',
};

const CONSUMPTION_STATE_ICONS: Record<string, IconName> = {
  found: 'sparkles',
  'saved-for-later': 'bookmark',
  exploring: 'compass',
  'in-progress': 'clock',
  completed: 'check-circle',
  abandoned: 'x-circle',
  archived: 'archive',
};

type StoredDocument = {
  slug: string;
  title: string;
  type: string;
  topicSlugs: string[];
  consumptionState: string;
  rating: string;
  language: string;
  year: string;
  hasFreeLinks: boolean;
  hasPaidLinks: boolean;
};

const SEARCH_INDEX_FIELDS = [
  'title',
  'alternativeTitle',
  'description',
  'reasonFound',
  'authors',
  'organizations',
  'topics',
  'collections',
  'type',
  'language',
  'platform',
  'identifiers',
  'relatedTitles',
];
const SEARCH_INDEX_STORE_FIELDS = [
  'slug',
  'title',
  'type',
  'topicSlugs',
  'consumptionState',
  'rating',
  'language',
  'year',
  'hasFreeLinks',
  'hasPaidLinks',
];

type FacetOption = { value: string; label: string; icon?: IconName };
type IconMap = Record<string, IconName>;

type Translate = (key: string) => string;

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

type ReferenceField = (reference: Reference) => string;

function collectFieldOptions(
  references: Reference[],
  field: ReferenceField,
  translate: Translate,
  icons?: IconMap,
): FacetOption[] {
  return uniqueSorted(references.map(field)).map((value) => ({
    value,
    label: translate(value),
    icon: icons?.[value],
  }));
}

function collectTopicOptions(references: Reference[]): FacetOption[] {
  const pairs = references.flatMap((reference) =>
    reference.topics.flatMap((name, index): [string, string][] => {
      const slug = reference.topicSlugs?.[index];
      return slug ? [[slug, name]] : [];
    }),
  );
  return [...new Map(pairs).entries()]
    .map(([value, label]) => ({ value, label, icon: 'tag' as const }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

function collectYearOptions(references: Reference[]): FacetOption[] {
  const years = references.flatMap((reference) =>
    reference.publishedDateISO ? [reference.publishedDateISO.slice(0, 4)] : [],
  );
  return uniqueSorted(years)
    .reverse()
    .map((value) => ({ value, label: value, icon: 'calendar' as const }));
}

type FacetOptions = {
  type: FacetOption[];
  topic: FacetOption[];
  rating: FacetOption[];
  consumptionState: FacetOption[];
  year: FacetOption[];
};

function useFacetOptions(references: Reference[], t: Translate): FacetOptions {
  return useMemo(
    () => ({
      type: collectFieldOptions(
        references,
        (r) => r.type,
        (v) => t(`types.${toMessageKey(v)}`),
        TYPE_ICONS,
      ),
      topic: collectTopicOptions(references),
      rating: collectFieldOptions(
        references,
        (r) => r.rating,
        (v) => t(`ratings.${toMessageKey(v)}`),
        RATING_ICONS,
      ),
      consumptionState: collectFieldOptions(
        references,
        (r) => r.consumptionState,
        (v) => t(`consumptionStates.${toMessageKey(v)}`),
        CONSUMPTION_STATE_ICONS,
      ),
      year: collectYearOptions(references),
    }),
    [references, t],
  );
}

function useSearchIndex(locale: string): MiniSearch<StoredDocument> | null {
  const [miniSearch, setMiniSearch] = useState<MiniSearch<StoredDocument> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/achados-search-index.${locale}.json`)
      .then((response) => response.text())
      .then((text) => {
        if (cancelled) {
          return;
        }
        setMiniSearch(
          MiniSearch.loadJSON<StoredDocument>(text, {
            idField: 'id',
            fields: SEARCH_INDEX_FIELDS,
            storeFields: SEARCH_INDEX_STORE_FIELDS,
          }),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return miniSearch;
}

type SelectedFacets = {
  type: string | null;
  topic: string | null;
  rating: string | null;
  consumptionState: string | null;
  year: string | null;
  freeOnly: boolean;
};

function selectedFacetValues(facets: SelectedFacets): (string | null)[] {
  return [facets.type, facets.topic, facets.rating, facets.consumptionState, facets.year];
}

function hasActiveFacet(query: string, facets: SelectedFacets): boolean {
  return Boolean(query.trim()) || facets.freeOnly || selectedFacetValues(facets).some(Boolean);
}

function matchesTaxonomy(
  reference: Reference,
  matchingSlugs: Set<string> | null,
  facets: SelectedFacets,
): boolean {
  if (matchingSlugs && !matchingSlugs.has(reference.slug)) {
    return false;
  }
  if (facets.type && reference.type !== facets.type) {
    return false;
  }
  return !(facets.topic && !reference.topicSlugs?.includes(facets.topic));
}

function matchesRatingAndState(reference: Reference, facets: SelectedFacets): boolean {
  if (facets.rating && reference.rating !== facets.rating) {
    return false;
  }
  return !(facets.consumptionState && reference.consumptionState !== facets.consumptionState);
}

function matchesYearAndAccess(reference: Reference, facets: SelectedFacets): boolean {
  if (facets.year && reference.publishedDateISO?.slice(0, 4) !== facets.year) {
    return false;
  }
  return !(facets.freeOnly && !reference.links.some((link) => link.isFree));
}

function matchesStateAndAccess(reference: Reference, facets: SelectedFacets): boolean {
  return matchesRatingAndState(reference, facets) && matchesYearAndAccess(reference, facets);
}

function matchingSlugsFor(
  query: string,
  miniSearch: MiniSearch<StoredDocument> | null,
): Set<string> | null {
  if (!query.trim() || !miniSearch) {
    return null;
  }
  const results = miniSearch.search(query, { prefix: true, fuzzy: 0.2 });
  return new Set(results.map((result) => String(result.id)));
}

function visibleSlugsFor(
  references: Reference[],
  query: string,
  facets: SelectedFacets,
  miniSearch: MiniSearch<StoredDocument> | null,
): Set<string> | null {
  if (!hasActiveFacet(query, facets)) {
    return null;
  }
  const matchingSlugs = matchingSlugsFor(query, miniSearch);
  const visible = references.filter(
    (reference) =>
      matchesTaxonomy(reference, matchingSlugs, facets) && matchesStateAndAccess(reference, facets),
  );
  return new Set(visible.map((reference) => reference.slug));
}

type FacetAutocompleteProps = {
  label: string;
  fieldIcon: IconName;
  options: FacetOption[];
  value: string | null;
  onChange: (value: string | null) => void;
};

function FacetAutocomplete(props: FacetAutocompleteProps) {
  const { label, fieldIcon, options, value, onChange } = props;
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, selected) => option.value === selected.value}
      value={options.find((option) => option.value === value) ?? null}
      onChange={(_event, option) => onChange(option?.value ?? null)}
      renderOption={(optionProps, option) => {
        const { key, ...rest } = optionProps;
        return (
          <Box component="li" key={key} {...rest}>
            <Icon
              name={option.icon ?? fieldIcon}
              size={16}
              style={{ opacity: 0.6, marginRight: '0.625rem' }}
            />
            {option.label}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <InputAdornment position="start">
                  <Icon name={fieldIcon} size={16} style={{ opacity: 0.5 }} />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
      size="small"
      fullWidth
    />
  );
}

type SearchAndFilterBarProps = {
  references: Reference[];
  onVisibleSlugsChange: (slugs: Set<string> | null) => void;
};

export function SearchAndFilterBar(props: SearchAndFilterBarProps) {
  const { references, onVisibleSlugsChange } = props;
  const locale = useLocale();
  const t = useTranslations('Pages.achados');
  const miniSearch = useSearchIndex(locale);
  const facetOptions = useFacetOptions(references, t);

  const [query, setQuery] = useState('');
  const [facets, setFacets] = useState<SelectedFacets>({
    type: null,
    topic: null,
    rating: null,
    consumptionState: null,
    year: null,
    freeOnly: false,
  });

  useEffect(() => {
    onVisibleSlugsChange(visibleSlugsFor(references, query, facets, miniSearch));
  }, [references, query, facets, miniSearch, onVisibleSlugsChange]);

  function setFacet<K extends keyof SelectedFacets>(key: K, value: SelectedFacets[K]) {
    setFacets((current) => ({ ...current, [key]: value }));
  }

  function clearFilters() {
    setQuery('');
    setFacets({
      type: null,
      topic: null,
      rating: null,
      consumptionState: null,
      year: null,
      freeOnly: false,
    });
  }

  const isActive = hasActiveFacet(query, facets);
  const activeFilterCount =
    selectedFacetValues(facets).filter(Boolean).length +
    (facets.freeOnly ? 1 : 0) +
    (query.trim() ? 1 : 0);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: '0.75rem',
        bgcolor: 'background.paper',
        p: { xs: 2, md: 2.5 },
        mb: { xs: 4, md: 5 },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          size="small"
          fullWidth
          sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Icon name="search" size={18} style={{ opacity: 0.5 }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <FacetAutocomplete
          label={t('typeFilterLabel')}
          fieldIcon="layout-grid"
          options={facetOptions.type}
          value={facets.type}
          onChange={(value) => setFacet('type', value)}
        />
        <FacetAutocomplete
          label={t('topicFilterLabel')}
          fieldIcon="tag"
          options={facetOptions.topic}
          value={facets.topic}
          onChange={(value) => setFacet('topic', value)}
        />
        <FacetAutocomplete
          label={t('ratingFilterLabel')}
          fieldIcon="star"
          options={facetOptions.rating}
          value={facets.rating}
          onChange={(value) => setFacet('rating', value)}
        />
        <FacetAutocomplete
          label={t('stateFilterLabel')}
          fieldIcon="compass"
          options={facetOptions.consumptionState}
          value={facets.consumptionState}
          onChange={(value) => setFacet('consumptionState', value)}
        />
        <FacetAutocomplete
          label={t('yearFilterLabel')}
          fieldIcon="calendar"
          options={facetOptions.year}
          value={facets.year}
          onChange={(value) => setFacet('year', value)}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1.5,
          mt: 2,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Chip
          label={t('freeOnlyLabel')}
          clickable
          color={facets.freeOnly ? 'secondary' : 'default'}
          variant={facets.freeOnly ? 'filled' : 'outlined'}
          onClick={() => setFacet('freeOnly', !facets.freeOnly)}
        />
        {isActive && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <Icon name="filter" size={14} style={{ opacity: 0.6 }} />
            {t('activeFiltersLabel', { count: activeFilterCount })}
          </Typography>
        )}
        {isActive && (
          <Chip
            icon={<Icon name="close" size={14} />}
            label={t('clearFilters')}
            clickable
            size="small"
            variant="outlined"
            onClick={clearFilters}
            sx={{ ml: 'auto' }}
          />
        )}
      </Box>
    </Box>
  );
}
