import type { ReactNode } from 'react';
import { FindingCardPresentation } from './finding-card-presentation';
import { FindingCardSummary } from './finding-card-summary';
import { CatalogFeedCardMetadata } from './catalog-feed-card-metadata';
import type { CatalogFeedCardProps } from './catalog-feed-card';

type CatalogFeedCardContentProps = CatalogFeedCardProps & { footer?: ReactNode };

export function CatalogFeedCardContent(props: CatalogFeedCardContentProps) {
  return (
    <FindingCardPresentation
      metadata={<CatalogFeedCardMetadata entry={props.entry} t={props.t} />}
      summary={
        <FindingCardSummary
          title={props.entry.title}
          href={props.entry.href}
          description={props.entry.description}
          headingLevel="h3"
        />
      }
      footer={props.footer}
    />
  );
}
