import { Typography } from '../../ui';
import { NavLink } from '../../primitives/nav-link';
import type { FeedCardProps } from './feed-card-types';

type FeedCardContentProps = Pick<FeedCardProps, 'entry'>;

export function FeedCardContent(props: FeedCardContentProps) {
  return (
    <>
      <Typography className="content-feed-title" component="h2" visualVariant="feedCard">
        <NavLink href={props.entry.href} underline="none" color="inherit">
          {props.entry.title}
        </NavLink>
      </Typography>
      <Typography visualVariant="feedCard2">{props.entry.preview}</Typography>
    </>
  );
}
