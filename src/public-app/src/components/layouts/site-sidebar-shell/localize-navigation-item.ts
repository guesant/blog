import type { Translator } from '@/i18n/compat-support';
import type { NavigationItem } from '@portfolio/data/domain/types';
import { routeSegment } from './route-segment';

const navigationTranslationKeys: Record<string, string> = {
  '': 'home',
  about: 'about',
  cases: 'cases',
  collections: 'collections',
  experiments: 'experiments',
  findings: 'findings',
  follow: 'follow',
  home: 'home',
  now: 'now',
  portfolio: 'portfolio',
  projects: 'projects',
  resume: 'resume',
  snippets: 'snippets',
  technologies: 'technologies',
  topics: 'topics',
  writing: 'writing',
};

type LocalizeNavigationItemProps = {
  item: NavigationItem;
  t: Translator;
};

export function localizeNavigationItem(props: LocalizeNavigationItemProps): NavigationItem {
  const translationKey = navigationTranslationKeys[routeSegment(props.item.route)];

  return {
    ...props.item,
    label: translationKey ? props.t(translationKey) : props.item.label,
    children: props.item.children.map((item) => localizeNavigationItem({ item, t: props.t })),
  };
}
