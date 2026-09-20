'use client';

import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../../content/page-header';
import { RandomStringForm } from './random-string-form';
import { useRandomStringState } from './use-random-string-state';
import type { CharacterSet } from './types';

export function RandomStringGenerator() {
  const t = useTranslations('Pages.toolsRandomStringGenerator');

  const state = useRandomStringState();

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      <RandomStringForm
        length={state.length}
        count={state.count}
        enabled={state.enabled}
        results={state.results}
        labels={t}
        onLengthChange={state.setLength}
        onCountChange={(value) => state.setCount(Math.min(50, Math.max(1, value)))}
        onEnabledChange={(name, checked) =>
          state.setEnabled({ ...state.enabled, [name as CharacterSet]: checked })
        }
        onGenerate={state.onGenerate}
      />
    </>
  );
}
