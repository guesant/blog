import type { GithubPreviewKind } from './resolve-github-preview-kind';

const githubPreviewIcons = {
  organization: 'building',
  repository: 'folder-git',
  user: 'user',
} as const;

export function githubPreviewIcon(
  kind: GithubPreviewKind,
): (typeof githubPreviewIcons)[GithubPreviewKind] {
  return githubPreviewIcons[kind];
}
