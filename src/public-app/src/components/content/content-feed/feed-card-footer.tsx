import { FindingCardFooterFrame, FindingCardReadAction } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { FeedCardTags } from './feed-card-tags';

type FeedCardFooterProps = Pick<FeedCardProps, 'entry' | 't'>;

export function FeedCardFooter(props: FeedCardFooterProps) {
  return (
    <FindingCardFooterFrame>
      <FeedCardTags entry={props.entry} t={props.t} />
      <FindingCardReadAction
        href={props.entry.href}
        label={props.t('readMore')}
        title={props.entry.title}
      >
        {props.t('readMore')}
      </FindingCardReadAction>
    </FindingCardFooterFrame>
  );
}
