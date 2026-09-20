import type { SiteText } from '@portfolio/data/domain/types';

export function sidebarCommitSha(build: SiteText['build']): string | undefined {
  return build?.commitSha?.slice(0, 7);
}
