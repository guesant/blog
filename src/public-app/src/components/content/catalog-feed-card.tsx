import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { HomeTranslator } from '@/i18n/compat-support';
import { FindingCardPresentation } from './finding-card-presentation';
import { FindingCardSummary } from './finding-card-summary';
import { CatalogFeedCardMetadata } from './catalog-feed-card-metadata';
import { FindingCardFooterFrame, FindingCardReadAction, FindingFeedCardFrame } from '../ui';

type CatalogFeedCardProps = {
  entry: HomeGalleryEntry;
  t: HomeTranslator;
};

export function CatalogFeedCard(props: CatalogFeedCardProps) {
  return (
    <FindingFeedCardFrame component="article">
      <FindingCardPresentation
        metadata={<CatalogFeedCardMetadata entry={props.entry} t={props.t} />}
        summary={
          <FindingCardSummary
            title={props.entry.title}
            href={props.entry.href}
            description={props.entry.description}
            headingLevel="h3"
            presentation="feed"
          />
        }
        footer={
          <FindingCardFooterFrame>
            <FindingCardReadAction
              href={props.entry.href}
              label={props.t('readMore')}
              title={props.entry.title}
              external={/^https?:\/\//.test(props.entry.href)}
            >
              {props.t('readMore')}
            </FindingCardReadAction>
          </FindingCardFooterFrame>
        }
      />
    </FindingFeedCardFrame>
  );
}
