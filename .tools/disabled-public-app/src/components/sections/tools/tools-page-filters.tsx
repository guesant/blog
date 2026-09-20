import { TextField } from '../../ui';
import type { Dispatch, SetStateAction } from 'react';
import type { useLocale, useTranslations } from '@/i18n/compat';
import { ListingFilters } from '../../content/listing-filters';
import { ToolCategoryField } from './tool-category-field';
import { handleToolsClear } from './tools-page-clear';
import { handleToolsSubmit } from './tools-page-submit';

type ToolsPageFiltersProps = {
  locale: ReturnType<typeof useLocale>;
  tNav: ReturnType<typeof useTranslations>;
  tListing: ReturnType<typeof useTranslations>;
  search: string;
  category: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setCategory: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
};

export function ToolsPageFilters(props: ToolsPageFiltersProps) {
  return (
    <ListingFilters
      onSubmit={handleToolsSubmit.bind(null, props.setPage)}
      onClear={handleToolsClear.bind(null, props.setSearch, props.setCategory, props.setPage)}
      applyLabel={props.tListing('apply')}
      clearLabel={props.tListing('clearFilters')}
    >
      <TextField
        size="small"
        label={props.tNav('search')}
        value={props.search}
        onChange={(event) => props.setSearch(event.target.value)}
        visualVariant="toolsSearchField"
      />
      <ToolCategoryField
        label={props.tNav('category')}
        allLabel={props.tNav('allCategories')}
        value={props.category}
        locale={props.locale}
        onChange={props.setCategory}
      />
    </ListingFilters>
  );
}
