import { ContentActionsPrimary } from './content-actions-primary';
import { ContentActionsSecondary } from './content-actions-secondary';
import type { ContentActionsItemsProps } from './content-actions-items-types';

export function ContentActionsItems(props: ContentActionsItemsProps) {
  return (
    <>
      <ContentActionsPrimary
        text={props.text}
        copy={props.copy}
        url={props.url}
        filename={props.filename}
        t={props.t}
        copied={props.copied}
        featureFlags={props.featureFlags}
      />
      <ContentActionsSecondary
        externalUrl={props.externalUrl}
        downloadUrl={props.downloadUrl}
        t={props.t}
      />
    </>
  );
}
