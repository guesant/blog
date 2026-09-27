import { Box, Typography } from '../../ui';
import { CollectionListing } from '../../content/collection-listing';
import { renderFollowEntryCard } from './render-follow-entry-card';
import type { FollowEntry } from './types';

type FollowFutureSectionProps = {
  entries: FollowEntry[];
  label: string;
  title: string;
};

export function FollowFutureSection(props: FollowFutureSectionProps) {
  return (
    <Box visualVariant="pageSectionStart">
      <Typography variant="overline" color="text.secondary">
        {props.label}
      </Typography>
      <Typography component="h2" variant="h2" visualVariant="followFutureTitle">
        {props.title}
      </Typography>
      <CollectionListing
        items={props.entries}
        getKey={(entry) => entry.key}
        renderListItem={renderFollowEntryCard}
      />
    </Box>
  );
}
