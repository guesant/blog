'use client';

import type { Reference } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { toMessageKey } from '@portfolio/data/config/achados';
import { ReferenceGridPage } from '../../content/reference-grid-page';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type TipoDetailContentProps = {
  tipo: string;
  references: Reference[];
  pagination: ContentCollectionMeta;
};

export function TipoDetailContent(props: TipoDetailContentProps) {
  const { tipo, references } = props;

  const tAchados = useTranslations('Pages.achados');

  return (
    <ReferenceGridPage
      title={tAchados(`types.${toMessageKey(tipo)}`)}
      references={references}
      pagination={props.pagination}
      action={`/findings/types/${tipo}`}
    />
  );
}
