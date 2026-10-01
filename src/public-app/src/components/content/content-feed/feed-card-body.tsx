import type { FeedCardProps } from './feed-card-types';
import { FeedCardFooter } from './feed-card-footer';
import { FeedCardHeader } from './feed-card-header';
import { getFeedCardCategoryLabel } from './feed-card-category-label';
import { FindingCardPresentation } from '../finding-card-presentation';
import { FindingCardSummary } from '../finding-card-summary';

type FeedCardBodyProps = FeedCardProps;

export function FeedCardBody(props: FeedCardBodyProps) {
  const category = props.entry.findingType
    ? getFeedCardCategoryLabel({ entry: props.entry, t: props.t })
    : undefined;

  const title = category ? `${props.entry.title} [${category}]` : props.entry.title;

  return (
    <FindingCardPresentation
      metadata={<FeedCardHeader {...props} />}
      summary={
        <FindingCardSummary
          title={title}
          href={props.entry.href}
          description={props.entry.preview}
          headingLevel="h2"
          presentation="feed"
        />
      }
      footer={<FeedCardFooter {...props} />}
    />
  );
}
