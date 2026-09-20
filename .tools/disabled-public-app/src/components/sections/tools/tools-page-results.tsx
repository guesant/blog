import { Typography } from '../../ui';
import type { useLocale, useTranslations } from '@/i18n/compat';
import { ListingPagination } from '../../content/listing-pagination';
import { ListingView } from '../../content/listing-view';
import { CatalogCard } from '../../content/catalog-card';
import { toolCategoryLabel, toolLabel } from '@portfolio/data/config/tool-catalog';
import type { filterTools } from './filter-tools';

type ToolsPageResultsProps = {
  locale: ReturnType<typeof useLocale>;
  tNav: ReturnType<typeof useTranslations>;
  tListing: ReturnType<typeof useTranslations>;
  page: number;
  pageCount: number;
  visibleTools: ReturnType<typeof filterTools>;
  setPage: (value: number) => void;
};

export function ToolsPageResults(props: ToolsPageResultsProps) {
  return (
    <>
      <ListingView
        items={props.visibleTools}
        getKey={(item) => item.slug}
        renderListItem={(tool) => (
          <CatalogCard href={`/tools/${tool.slug}`}>
            <Typography variant="overline" color="text.secondary">
              {toolCategoryLabel(tool.category, props.locale)}
            </Typography>
            <Typography component="h2" variant="h5">
              {toolLabel(tool.slug, props.locale)}
            </Typography>
          </CatalogCard>
        )}
      />
      <ListingPagination
        page={props.page}
        pageCount={props.pageCount}
        ariaLabel={props.tNav('tools')}
        firstLabel={props.tListing('first')}
        previousLabel={props.tListing('previous')}
        nextLabel={props.tListing('next')}
        lastLabel={props.tListing('last')}
        onPageChange={props.setPage}
      />
    </>
  );
}
