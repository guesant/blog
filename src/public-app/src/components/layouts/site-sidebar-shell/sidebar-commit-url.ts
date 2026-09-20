import type { SiteText } from '@portfolio/data/domain/types';

export function sidebarCommitUrl(
  sourceRepositoryUrl: string | undefined,
  build: SiteText['build'],
): string | undefined {
  const commitSha = build?.commitSha;

  return sourceRepositoryUrl && commitSha
    ? `${sourceRepositoryUrl.replace(/\/$/, '')}/commit/${commitSha}`
    : undefined;
}
