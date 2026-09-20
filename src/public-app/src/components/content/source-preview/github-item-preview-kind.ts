import type { GithubPreviewKind } from './resolve-github-preview-kind';
import { githubItemPreviewKindResult } from './github-item-preview-kind-result';

type GithubItemPreviewKindProps = {
  first?: string;
  second?: string;
  itemType?: string;
};

export function githubItemPreviewKind(
  props: GithubItemPreviewKindProps,
): GithubPreviewKind | undefined {
  if (!props.first) {
    return undefined;
  }

  return githubItemPreviewKindResult({
    hasRepository: Boolean(props.second),
    itemType: props.itemType,
  });
}
