import type { ExternalLink } from '@portfolio/data/domain/types';
import { nonEmpty } from './source-preview-non-empty';

type GenericPreviewTitleProps = {
  link: ExternalLink;
  host: string;
};

export function genericPreviewTitle(props: GenericPreviewTitleProps): string {
  return (
    [props.link.openGraph?.title, props.link.label, props.link.platform]
      .map(nonEmpty)
      .find(Boolean) ?? props.host
  );
}
