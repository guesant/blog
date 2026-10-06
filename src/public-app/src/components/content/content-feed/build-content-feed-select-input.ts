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
    type: state.type,
    writingsCount: props.feedItems.filter((item) => item.kind === 'post').length,
    findingsCount: props.feedItems.filter((item) => item.kind === 'achado').length,
    collectionsCount: props.feedItems.filter((item) => item.kind === 'colecao').length,
    topics: data.topics,
    findingTypes: data.findingTypes,
    onKindChange: state.setKind,
    onTopicChange: state.setTopic,
    onTypeChange: state.setType,
    contentLabel: translations.contentLabel,
    writingLabel: translations.writingLabel,
    findingsLabel: translations.findingsLabel,
    collectionsLabel: translations.collectionsLabel,
    topicLabel: translations.topicLabel,
    typeLabel: translations.typeLabel,
    typeMessage: (value) => translations.tPages(`types.${value}`),
  };
}
