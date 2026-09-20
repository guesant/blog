'use client';

import { useLocale, useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import { ToolsPageFilters } from './tools-page-filters';
import { ToolsPageResults } from './tools-page-results';
import { useToolsPageState } from './use-tools-page-state';

export function ToolsPageContent() {
  const locale = useLocale();

  const tNav = useTranslations('Nav');

  const tListing = useTranslations('Pages.achados');

  const state = useToolsPageState(locale);

  return (
    <>
      <PageHeader
        eyebrow={tNav('tools')}
        title={tNav('tools')}
        description={tNav('toolsDescription')}
        breadcrumbs={[{ label: tNav('tools') }]}
      />
      <ToolsPageFilters
        locale={locale}
        tNav={tNav}
        tListing={tListing}
        search={state.search}
        category={state.category}
        setSearch={state.setSearch}
        setCategory={state.setCategory}
        setPage={state.setPage}
      />
      <ToolsPageResults
        locale={locale}
        tNav={tNav}
        tListing={tListing}
        page={state.page}
        pageCount={state.pageCount}
        visibleTools={state.visibleTools}
        setPage={state.setPage}
      />
    </>
  );
}
