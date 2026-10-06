import type { Locale } from './compat-support';
import { getMessages } from './messages';
import { translator } from './compat-translator';
import { findingDisplayTitle } from './finding-display-title';
import { findingTypeLabel } from './finding-type-label';

export function localizedFindingDisplayTitle(
  title: string,
  type: string | undefined,
  locale: Locale,
): string {
  const t = translator(getMessages(locale), 'Pages.achados');

  return findingDisplayTitle({ title, typeLabel: findingTypeLabel(type, t) });
}
