import { EditorialFeedItemFooterFrame, FindingCardReadAction } from '../ui';
import type { CatalogFeedCardProps } from './catalog-feed-card';

type EditorialCatalogFeedCardFooterProps = CatalogFeedCardProps;

export function EditorialCatalogFeedCardFooter(props: EditorialCatalogFeedCardFooterProps) {
  return (
    <EditorialFeedItemFooterFrame>
      <FindingCardReadAction
        href={props.entry.href}
        label={props.t('readMore')}
        title={props.entry.title}
        external={/^https?:\/\//.test(props.entry.href)}
      >
        {props.t('readMore')}
      </FindingCardReadAction>
    </EditorialFeedItemFooterFrame>
  );
}
