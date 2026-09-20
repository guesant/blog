import type { SiteText } from '@portfolio/data/domain/types';
import { sidebarCommitSha } from './sidebar-commit-sha';
import { sidebarCommitUrl } from './sidebar-commit-url';

type BuildSidebarBuildUrlProps = Pick<SiteText, 'sourceRepositoryUrl' | 'build'>;

export function buildSidebarBuildUrl(props: BuildSidebarBuildUrlProps) {
  const buildSha = sidebarCommitSha(props.build);

  return {
    buildSha,
    buildUrl: sidebarCommitUrl(props.sourceRepositoryUrl, props.build),
  };
}
