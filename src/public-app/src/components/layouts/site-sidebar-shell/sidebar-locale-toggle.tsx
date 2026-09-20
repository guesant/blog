'use client';

import { ToggleButton } from '../../ui';
import { routing } from '../../../i18n/routing';

type SidebarLocaleToggleProps = { item: (typeof routing.locales)[number] };

export function SidebarLocaleToggle(props: SidebarLocaleToggleProps) {
  const { item } = props;

  return <ToggleButton value={item}>{item === 'en' ? 'EN' : 'PT'}</ToggleButton>;
}
