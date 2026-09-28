import type { ReactNode } from 'react';
import { CatalogEntryContent } from '../ui';

type CatalogEntrySummaryProps = {
  meta?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  titleComponent?: 'h2' | 'h3';
};

export function CatalogEntrySummary(props: CatalogEntrySummaryProps) {
  return (
    <CatalogEntryContent
      meta={props.meta}
      title={props.title}
      description={props.description}
      titleComponent={props.titleComponent}
    />
  );
}
