import { Typography } from '../../ui';
import { CollectionListing } from '../../content/collection-listing';
import { renderFollowEntryCard } from './render-follow-entry-card';
import type { FollowEntry } from './types';
import { FollowFutureTitleText } from '../../ui/semantic/FollowFutureTitleText';
import { PageSectionLeadingSpacingFrame } from '../../ui/semantic/PageSectionLeadingSpacingFrame';

type FollowFutureSectionProps = {
  entries: FollowEntry[];
  label: string;
  title: string;
};

export function FollowFutureSection(props: FollowFutureSectionProps) {
  return (
    <PageSectionLeadingSpacingFrame>
      <Typography variant="overline" color="text.secondary">
        {props.label}
      </Typography>
      <FollowFutureTitleText component="h2" variant="h2">
        {props.title}
      </FollowFutureTitleText>
      <CollectionListing
        items={props.entries}
        getKey={(entry) => entry.key}
        renderListItem={renderFollowEntryCard}
      />
    </PageSectionLeadingSpacingFrame>
  );
}
