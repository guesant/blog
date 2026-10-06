import { ExternalLink } from '../../primitives/external-link';
import type { FeedCardProps } from './feed-card-types';
import type { FeedEntry } from './types';

type FeedCardExternalLinkAnchorProps = Pick<FeedCardProps, 't'> & {
  link: NonNullable<FeedEntry['links']>[number];
};

export function FeedCardExternalLinkAnchor(props: FeedCardExternalLinkAnchorProps) {
  return (
    <ExternalLink href={props.link.url} title={props.link.label ?? props.link.url}>
      {props.t('sourcePreview.kinds.link')}
    </ExternalLink>
  );
}
