import type { FeedCardProps } from './feed-card-types';
import { FindingCardSummary } from '../finding-card-summary';

type FeedCardContentProps = Pick<FeedCardProps, 'entry'>;

export function FeedCardContent(props: FeedCardContentProps) {
  return (
    <FindingCardSummary
      title={props.entry.title}
      href={props.entry.href}
      description={props.entry.preview}
      headingLevel="h2"
      titleClassName="content-feed-title"
      titleVisualVariant="feedCard"
      descriptionVisualVariant="feedCard2"
    />
  );
}
