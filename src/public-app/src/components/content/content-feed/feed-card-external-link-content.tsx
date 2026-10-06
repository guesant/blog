import type { FeedCardProps } from './feed-card-types';
import type { FeedEntry } from './types';
import { FeedCardExternalLinkAnchor } from './feed-card-external-link-anchor';

type FeedCardExternalLinkContentProps = Pick<FeedCardProps, 't'> & {
  entry: FeedEntry;
  link: NonNullable<FeedEntry['links']>[number] | undefined;
};

export function FeedCardExternalLinkContent(props: FeedCardExternalLinkContentProps) {
  if (props.entry.kind !== 'achado' || !props.link) {
    return null;
  }

  return <FeedCardExternalLinkAnchor link={props.link} t={props.t} />;
}
