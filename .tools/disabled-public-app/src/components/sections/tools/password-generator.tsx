'use client';

import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import { PasswordGeneratorForm } from './password-generator-form';
import { usePasswordGeneratorState } from './use-password-generator-state';
import type { CharacterSet } from './password-generator-types';

export function PasswordGenerator() {
  const t = useTranslations('Pages.toolsPasswordGenerator');

  const state = usePasswordGeneratorState();

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      <PasswordGeneratorForm
        length={state.length}
        enabled={state.enabled}
        result={state.result}
        copied={state.copied}
        labels={t}
        onLengthChange={state.setLength}
        onEnabledChange={(name, checked) =>
          state.setEnabled({ ...state.enabled, [name as CharacterSet]: checked })
        }
        onCopy={state.onCopy}
        onGenerate={state.onGenerate}
      />
    </>
  );
}
