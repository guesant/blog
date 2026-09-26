import type { ReactNode } from 'react';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import { CollectionListing } from './collection-listing';
import { PageHeader } from './page-header';

type CatalogPageContentProps<T> = {
  breadcrumbs: Array<{ label: string }>;
  description: string;
  empty?: ReactNode;
  getKey: (item: T) => string;
  items: T[];
  pagination: ContentCollectionMeta;
  paginationAction: string;
  renderListItem: (item: T) => ReactNode;
  title: string;
};

export function CatalogPageContent<T>(props: CatalogPageContentProps<T>) {
  return (
    <>
      <PageHeader
        title={props.title}
        description={props.description}
        breadcrumbs={props.breadcrumbs}
      />
      <CollectionListing
        items={props.items}
        getKey={props.getKey}
        renderListItem={props.renderListItem}
        empty={props.empty}
        pagination={{ meta: props.pagination, action: props.paginationAction }}
      />
    </>
  );
}
