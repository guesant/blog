import { ConditionalContent } from '../../primitives/conditional-content';
import { CollectionListing } from '../../content/collection-listing';
import { renderFollowEntryCard } from './render-follow-entry-card';
import type { FollowEntry } from './types';
import { FollowFutureTitleText } from '../../ui/semantic/FollowFutureTitleText';
import { FollowSectionFrame } from '../../ui/semantic/FollowSectionFrame';

type FollowFutureSectionProps = {
  entries: FollowEntry[];
  title: string;
};

export function FollowFutureSection(props: FollowFutureSectionProps) {
  return (
    <FollowSectionFrame component="section">
      <ConditionalContent
        condition={Boolean(props.title)}
        content={
          <FollowFutureTitleText component="h2" variant="h2">
            {props.title}
          </FollowFutureTitleText>
        }
      />
      <CollectionListing
        items={props.entries}
        getKey={(entry) => entry.key}
        renderListItem={renderFollowEntryCard}
      />
    </FollowSectionFrame>
  );
}
