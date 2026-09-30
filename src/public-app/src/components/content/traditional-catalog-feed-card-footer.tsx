import { FindingCardFooterFrame, FindingCardReadAction } from '../ui';
import type { CatalogFeedCardProps } from './catalog-feed-card';

type TraditionalCatalogFeedCardFooterProps = CatalogFeedCardProps;

export function TraditionalCatalogFeedCardFooter(props: TraditionalCatalogFeedCardFooterProps) {
  return (
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
  );
}
