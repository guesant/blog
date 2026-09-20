'use client';

import { ToggleButton, ToggleButtonGroup, BrightnessAuto, DarkMode, LightMode } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { useThemeMode } from '../../ui/theme-registry';
import type { ThemeMode } from '@portfolio/data/config/theme';

type SidebarThemeButtonProps = { t: ReturnType<typeof useTranslations> };

export function SidebarThemeButton(props: SidebarThemeButtonProps) {
  const { t } = props;

  const { mode, setMode } = useThemeMode();

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={mode}
      onChange={(_event: unknown, value: ThemeMode | null) => value && setMode(value)}
      aria-label={t('theme')}
      visualVariant="sidebarToggleGroup"
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
    </ToggleButtonGroup>
  );
}
