import { FindingFeedCardFrame } from '../ui';
import { CatalogFeedCardContent } from './catalog-feed-card-content';
import type { CatalogFeedCardProps } from './catalog-feed-card';
import { TraditionalCatalogFeedCardFooter } from './traditional-catalog-feed-card-footer';

type TraditionalCatalogFeedCardProps = CatalogFeedCardProps;

export function TraditionalCatalogFeedCard(props: TraditionalCatalogFeedCardProps) {
  return (
    <FindingFeedCardFrame component="article">
      <CatalogFeedCardContent {...props} footer={<TraditionalCatalogFeedCardFooter {...props} />} />
    </FindingFeedCardFrame>
  );
}
