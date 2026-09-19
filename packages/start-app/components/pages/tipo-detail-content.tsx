'use client';

import type { Reference } from '@portfolio/content/types';
import { useTranslations } from '@/i18n/compat';
import { toMessageKey } from '../../content/achados';
import { ReferenceGridPage } from '../content/reference-grid-page';

type TipoDetailContentProps = { tipo: string; references: Reference[] };

export function TipoDetailContent(props: TipoDetailContentProps) {
  const { tipo, references } = props;
  const tAchados = useTranslations('Pages.achados');

  return (
    <ReferenceGridPage title={tAchados(`types.${toMessageKey(tipo)}`)} references={references} />
  );
}
