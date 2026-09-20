import type { Translator } from '@/i18n/compat-support';

type BuildLeftSidebarBackNavigationProps = {
  pathname: string;
  tNav: Translator;
};

export function buildLeftSidebarBackNavigation(props: BuildLeftSidebarBackNavigationProps) {
  const routeSegments = props.pathname.split('/').filter(Boolean);

  let backHref: string | undefined;

  if (props.pathname !== '/') {
    backHref = routeSegments.length > 1 ? `/${routeSegments[0]}` : '/';
  }

  return {
    backHref,
    backLabel:
      routeSegments.length > 1
        ? ({
            writing: props.tNav('writing'),
            findings: props.tNav('achados'),
            collections: props.tNav('collections'),
            snippets: props.tNav('snippets'),
            topics: props.tNav('topics'),
            technologies: props.tNav('technologies'),
            cases: props.tNav('work'),
            projects: props.tNav('projects'),
          }[routeSegments[0]] ?? routeSegments[0])
        : props.tNav('home'),
  };
}
