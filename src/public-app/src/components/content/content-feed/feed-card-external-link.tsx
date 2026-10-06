import type { FeedCardProps } from './feed-card-types';
import { FeedCardExternalLinkContent } from './feed-card-external-link-content';
import { getFeedCardExternalLink } from './get-feed-card-external-link';

type FeedCardExternalLinkProps = Pick<FeedCardProps, 'entry' | 't'>;

export function FeedCardExternalLink(props: FeedCardExternalLinkProps) {
  const link = getFeedCardExternalLink(props.entry);

  return <FeedCardExternalLinkContent entry={props.entry} link={link} t={props.t} />;
}
