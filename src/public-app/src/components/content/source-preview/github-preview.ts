import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { nonEmpty } from './source-preview-non-empty';
import { pathSegments } from './source-preview-path-segments';
import { createGithubPreview } from './create-github-preview';
import { githubPreviewIdentity } from './github-preview-identity';
import { resolveGithubPreviewKind } from './resolve-github-preview-kind';
import type { SourcePreviewData } from './types';

export function githubPreview(
  item: Reference,
  link: ExternalLink,
  url: URL,
): SourcePreviewData | undefined {
  const segments = pathSegments(url);

  const details = item.repo;

  const [first, second] = segments;

  const kind = resolveGithubPreviewKind({ first, second, itemType: item.type });

  if (!kind) {
    return undefined;
  }

  const identity = githubPreviewIdentity({
    kind,
    repositoryOwner: nonEmpty(details?.org),
    repositoryName: nonEmpty(details?.name),
    first,
    second,
  });

  if (!identity.owner) {
    return undefined;
  }

  return createGithubPreview({
    item,
    link,
    kind,
    owner: identity.owner,
    name: identity.name,
  });
}
