import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { HomeTranslator } from '@/i18n/compat-support';
import { FindingCardPresentation } from '../../content/finding-card-presentation';
import { FindingCardSummary } from '../../content/finding-card-summary';
import {
  FindingCardFooterFrame,
  FindingCardKindChip,
  FindingCardMetadataRow,
  FindingCardReadAction,
  FindingFeedCardFrame,
} from '../../ui';

type HomeGalleryCatalogCardProps = {
  entry: HomeGalleryEntry;
  t: HomeTranslator;
};

export function HomeGalleryCatalogCard(props: HomeGalleryCatalogCardProps) {
  return (
    <FindingFeedCardFrame component="article">
      <FindingCardPresentation
        metadata={
          <FindingCardMetadataRow>
            <FindingCardKindChip>{props.t(`kind.${props.entry.kind}`)}</FindingCardKindChip>
          </FindingCardMetadataRow>
        }
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
