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

  const categorySuffix = category ? ` [${category}]` : '';

  const title =
    props.entry.kind === 'achado'
      ? `${props.t('finding')}: ${props.entry.title}${categorySuffix}`
      : props.entry.title;

  const titleFontSize = props.entry.kind === 'post' ? 'var(--site-text-xl)' : undefined;

  return (
    <FindingCardPresentation
      summary={
        <FindingCardSummary
          title={title}
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
