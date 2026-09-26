'use client';

import { ToggleButtonGroup } from '../../ui';
import { useRouter } from '@/i18n/compat';
import type { SidebarTranslator } from '@/i18n/compat-support';
import { routing } from '../../../i18n/routing';
import { SidebarThemeButton } from './sidebar-theme-button';
import { SidebarLocaleToggle } from './sidebar-locale-toggle';
import { SidebarSection } from './sidebar-section';
import { handleSidebarLocaleChange } from './handle-sidebar-locale-change';

type SidebarPreferencesProps = {
  pathname: string;
  locale: string;
  t: SidebarTranslator;
};

export function SidebarPreferences(props: SidebarPreferencesProps) {
  const { pathname, locale, t } = props;

  const router = useRouter();

  return (
    <SidebarSection label={t('preferences')}>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={locale}
        onChange={handleSidebarLocaleChange.bind(null, { router, pathname })}
        aria-label={t('language')}
        visualVariant="sidebarToggleGroup"
      >
        {routing.locales.map((item) => (
          <SidebarLocaleToggle key={item} item={item} />
        ))}
      </ToggleButtonGroup>
      <SidebarThemeButton t={t} />
    </SidebarSection>
  );
}
