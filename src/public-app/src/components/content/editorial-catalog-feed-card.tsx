import { EditorialFeedItemFrame } from '../ui';
import { CatalogFeedCardContent } from './catalog-feed-card-content';
import type { CatalogFeedCardProps } from './catalog-feed-card';
import { EditorialCatalogFeedCardFooter } from './editorial-catalog-feed-card-footer';

type EditorialCatalogFeedCardProps = CatalogFeedCardProps;

export function EditorialCatalogFeedCard(props: EditorialCatalogFeedCardProps) {
  return (
    <EditorialFeedItemFrame component="article">
      <CatalogFeedCardContent {...props} footer={<EditorialCatalogFeedCardFooter {...props} />} />
    </EditorialFeedItemFrame>
  );
}
