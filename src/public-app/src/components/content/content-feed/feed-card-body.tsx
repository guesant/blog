import type { FeedCardProps } from './feed-card-types';
import { FeedCardFooter } from './feed-card-footer';
import { FeedCardHeader } from './feed-card-header';
import { FeedCardCategory } from './feed-card-category';
import { FindingCardPresentation } from '../finding-card-presentation';
import { FindingCardSummary } from '../finding-card-summary';

type FeedCardBodyProps = FeedCardProps;

export function FeedCardBody(props: FeedCardBodyProps) {
  const category = props.entry.findingType ? (
    <FeedCardCategory entry={props.entry} t={props.t} />
  ) : undefined;

  return (
    <FindingCardPresentation
      metadata={<FeedCardHeader {...props} />}
      summary={
        <FindingCardSummary
          title={props.entry.title}
          href={props.entry.href}
          description={props.entry.preview}
          headingLevel="h2"
          presentation="feed"
          titleLeading={category}
        />
      }
      footer={<FeedCardFooter {...props} />}
    />
  );
}
