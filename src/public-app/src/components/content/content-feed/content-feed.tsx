'use client';

import { ContentFeedView } from './content-feed-view';
import type { ContentFeedProps } from './types';
import { useContentFeedRuntime } from './use-content-feed-runtime';
import { useContentFeedViewProps } from './use-content-feed-view-props';

export function ContentFeed(props: ContentFeedProps) {
  const runtime = useContentFeedRuntime(props);

  const viewProps = useContentFeedViewProps({ props, runtime });

  return <ContentFeedView {...viewProps} beforeExplore={props.beforeExplore} />;
}
