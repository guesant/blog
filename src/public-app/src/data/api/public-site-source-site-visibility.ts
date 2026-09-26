import type { SiteVisibility } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';

const visibilityFields = [
  ['about', 'about'],
  ['resume', 'resume'],
  ['portfolio', 'portfolio'],
  ['cases', 'cases'],
  ['contact', 'contact'],
  ['license', 'license'],
  ['credits', 'credits'],
  ['follow', 'follow'],
  ['feed', 'feed'],
  ['writing', 'writing'],
  ['findings', 'findings'],
  ['topics', 'topics'],
  ['collections', 'collections'],
  ['snippets', 'snippets'],
  ['rightSidebar', 'right_sidebar'],
] as const satisfies ReadonlyArray<readonly [keyof SiteVisibility, string]>;

export function siteVisibility(value: RecordValue): SiteVisibility {
  return Object.fromEntries(
    visibilityFields.map(([field, source]) => [field, value[source] === true]),
  ) as SiteVisibility;
}
