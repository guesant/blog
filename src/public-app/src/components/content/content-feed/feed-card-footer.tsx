import { ArrowForward, Box, Button, VisuallyHidden } from '../../ui';
import { NavLink } from '../../primitives/nav-link';
import type { FeedCardProps } from './feed-card-types';
import { FeedCardTags } from './feed-card-tags';

type FeedCardFooterProps = Pick<FeedCardProps, 'entry' | 't'>;

export function FeedCardFooter(props: FeedCardFooterProps) {
  return (
    <Box visualVariant="feedCard">
      <FeedCardTags entry={props.entry} t={props.t} />
      <Button
        component={NavLink}
        href={props.entry.href}
        data-action="read-more"
        siteVariant="action"
        size="small"
        variant="outlined"
        aria-label={`${props.t('readMore')}: ${props.entry.title}`}
        endIcon={<ArrowForward visualVariant="feedCard" />}
        visualVariant="feedCardReadMore"
      >
        {props.t('readMore')}
        <VisuallyHidden>{props.entry.title}</VisuallyHidden>
      </Button>
    </Box>
  );
}
