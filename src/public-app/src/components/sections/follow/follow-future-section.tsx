import { Typography } from '../../ui';
import { CollectionListing } from '../../content/collection-listing';
import { renderFollowEntryCard } from './render-follow-entry-card';
import type { FollowEntry } from './types';
import { FollowFutureTitleText } from '../../ui/semantic/FollowFutureTitleText';
import { PageSectionStartFrame } from '../../ui/semantic/PageSectionStartFrame';

type FollowFutureSectionProps = {
  entries: FollowEntry[];
  label: string;
  title: string;
};

export function FollowFutureSection(props: FollowFutureSectionProps) {
  return (
    <PageSectionStartFrame>
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
    </PageSectionStartFrame>
  );
}
