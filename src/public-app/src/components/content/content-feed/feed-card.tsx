import { Card } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { FeedCardBody } from './feed-card-body';

export function FeedCard(props: FeedCardProps) {
  return (
    <Card component="article" visualVariant="feedCard" children={<FeedCardBody {...props} />} />
  );
}
