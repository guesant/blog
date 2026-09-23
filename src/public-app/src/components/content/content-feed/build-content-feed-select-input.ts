import { buildContentFeedSelectDefinitions } from './build-content-feed-select-definitions';
import type { UseContentFeedViewPropsInput } from './use-content-feed-view-props.types';

type ContentFeedSelectInput = Parameters<typeof buildContentFeedSelectDefinitions>[0];

export function buildContentFeedSelectInput(
  input: UseContentFeedViewPropsInput,
): ContentFeedSelectInput {
  return {
    fixedKind: input.props.fixedKind,
    availableKindCount: input.runtime.data.availableKindCount,
    kind: input.runtime.state.kind,
    topic: input.runtime.state.topic,
    type: input.runtime.state.type,
    sort: input.runtime.state.sort,
    writingsCount: input.props.writings.length,
    findingsCount: input.props.findings.length,
    collectionsCount: input.props.collections.length,
    topics: input.runtime.data.topics,
    findingTypes: input.runtime.data.findingTypes,
    onKindChange: input.runtime.state.setKind,
    onTopicChange: input.runtime.state.setTopic,
    onTypeChange: input.runtime.state.setType,
    onSortChange: input.runtime.state.setSort,
    contentLabel: input.runtime.translations.contentLabel,
    writingLabel: input.runtime.translations.writingLabel,
    findingsLabel: input.runtime.translations.findingsLabel,
    collectionsLabel: input.runtime.translations.collectionsLabel,
    topicLabel: input.runtime.translations.topicLabel,
    typeLabel: input.runtime.translations.typeLabel,
    typeMessage: (value) => input.runtime.translations.tPages(`types.${value}`),
    sortLabel: input.runtime.translations.sortLabel,
    newestLabel: input.runtime.translations.newestLabel,
    oldestLabel: input.runtime.translations.oldestLabel,
    alphabeticalLabel: input.runtime.translations.alphabeticalLabel,
    popularLabel: input.runtime.translations.popularLabel,
  };
}
