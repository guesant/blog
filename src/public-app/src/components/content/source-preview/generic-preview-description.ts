import type { ExternalLink } from '@portfolio/data/domain/types';
import { nonEmpty } from './source-preview-non-empty';

type GenericPreviewDescriptionProps = {
  link: ExternalLink;
  host: string;
};

export function genericPreviewDescription(props: GenericPreviewDescriptionProps): string {
  return (
    [props.link.openGraph?.description, props.link.note].map(nonEmpty).find(Boolean) ?? props.host
  );
}
