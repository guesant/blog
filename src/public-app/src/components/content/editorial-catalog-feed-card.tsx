import { EditorialFeedItemFrame } from '../ui';
import { CatalogFeedCardContent } from './catalog-feed-card-content';
import type { CatalogFeedCardProps } from './catalog-feed-card';

type EditorialCatalogFeedCardProps = CatalogFeedCardProps;

export function EditorialCatalogFeedCard(props: EditorialCatalogFeedCardProps) {
  return (
    <EditorialFeedItemFrame component="article">
      <CatalogFeedCardContent {...props} />
    </EditorialFeedItemFrame>
  );
}
