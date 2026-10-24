import { buildContentFeedSelectDefinitions } from './build-content-feed-select-definitions';
import type { UseContentFeedViewPropsInput } from './use-content-feed-view-props.types';

type ContentFeedSelectInput = Parameters<typeof buildContentFeedSelectDefinitions>[0];

export function buildContentFeedSelectInput(
  input: UseContentFeedViewPropsInput,
): ContentFeedSelectInput {
  const { props, runtime } = input;

  const { data, state, translations } = runtime;

  return {
    fixedKind: props.fixedKind,
    availableKindCount: data.availableKindCount,
    kind: state.kind,
    topic: state.topic,
    writingsCount: props.feedItems.filter((item) => item.kind === 'post').length,
    collectionsCount: props.feedItems.filter((item) => item.kind === 'colecao').length,
    topics: data.topics,
    onKindChange: state.setKind,
    onTopicChange: state.setTopic,
    contentLabel: translations.contentLabel,
    writingLabel: translations.writingLabel,
    collectionsLabel: translations.collectionsLabel,
    topicLabel: translations.topicLabel,
  };
}
