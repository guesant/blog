'use client';

import { ToggleButton, BrightnessAuto, DarkMode, LightMode, SidebarToggleGroup } from '../../ui';
import type { SidebarTranslator } from '@/i18n/compat-support';
import { useThemeMode } from '../../ui/theme-registry';
import type { ThemeMode } from '@portfolio/data/config/theme';

type SidebarThemeButtonProps = { t: SidebarTranslator };

export function SidebarThemeButton(props: SidebarThemeButtonProps) {
  const { t } = props;

  const { mode, setMode } = useThemeMode();

  return (
    <SidebarToggleGroup
      exclusive
      size="small"
      value={mode}
      onChange={(_event: unknown, value: ThemeMode | null) => value && setMode(value)}
      aria-label={t('theme')}
    >
      <ToggleButton value="system" aria-label={t('systemTheme')} title={t('systemTheme')}>
        <BrightnessAuto fontSize="small" />
      </ToggleButton>
      <ToggleButton value="light" aria-label={t('lightTheme')} title={t('lightTheme')}>
        <LightMode fontSize="small" />
      </ToggleButton>
      <ToggleButton value="dark" aria-label={t('darkTheme')} title={t('darkTheme')}>
        <DarkMode fontSize="small" />
      </ToggleButton>
    </SidebarToggleGroup>
  );
}
