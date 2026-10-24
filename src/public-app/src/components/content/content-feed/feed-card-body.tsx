import type { FeedCardProps } from './feed-card-types';
import { FeedCardFooter } from './feed-card-footer';
import { FeedCardHeader } from './feed-card-header';
import { FindingCardPresentation } from '../finding-card-presentation';
import { FindingCardSummary } from '../finding-card-summary';

type FeedCardBodyProps = FeedCardProps;

export function FeedCardBody(props: FeedCardBodyProps) {
  const titleFontSize = props.entry.kind === 'post' ? 'var(--site-text-2xl)' : undefined;

  return (
    <FindingCardPresentation
      summary={
        <FindingCardSummary
          title={props.entry.title}
          href={props.entry.href}
          description={props.entry.preview}
          metadata={<FeedCardHeader {...props} />}
          headingLevel="h2"
          titleFontSize={titleFontSize}
        />
      }
      footer={<FeedCardFooter {...props} />}
    />
  );
}
