import type { ReactNode } from 'react';
import { ConditionalContent } from '../primitives/conditional-content';
import { CollectionPagination, type CollectionPaginationProps } from './collection-pagination';
import { ListingView } from './listing-view';

export type CollectionListingProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderListItem: (item: T) => ReactNode;
  empty?: ReactNode;
  pagination?: CollectionPaginationProps;
};

export function CollectionListing<T>(props: CollectionListingProps<T>) {
  const hasItems = props.items.length > 0;

  return (
    <>
      <ConditionalContent condition={!hasItems} content={props.empty} />
      <ConditionalContent
        condition={hasItems}
        content={
          <ListingView
            items={props.items}
            getKey={props.getKey}
            renderListItem={props.renderListItem}
          />
        }
      />
      <ConditionalContent
        condition={props.pagination !== undefined}
        content={props.pagination ? <CollectionPagination {...props.pagination} /> : null}
      />
    </>
  );
}
