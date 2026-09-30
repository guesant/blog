import type { SiteText } from '../domain/types.ts';
import { recordOrEmpty } from './public-site-source-record-or-empty';
import type { RecordValue } from './public-site-source-support';

export function siteFeatureFlags(value: RecordValue): SiteText['featureFlags'] {
  const contentActions = recordOrEmpty(value.content_actions);

  const feed = recordOrEmpty(value.feed);

  return {
    contentActions: {
      copyText: contentActions.copy_text === true,
      copyUrl: contentActions.copy_url === true,
      downloadText: contentActions.download_text === true,
    },
    contextualCursor: value.contextual_cursor === true,
    feed: {
      flatCards: feed.flat_cards !== false,
    },
  };
}
