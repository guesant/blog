'use client';

import { Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import type { SourcePreviewMetadata } from './types';

type SourcePreviewListMetadataItemProps = { entry: SourcePreviewMetadata };

export function SourcePreviewListMetadataItem(props: SourcePreviewListMetadataItemProps) {
  const t = useTranslations('Pages.achados');

  return (
    <Typography component="span" visualVariant="sourcePreviewListMetadataItem">
      {t(`sourcePreview.fields.${props.entry.key}`)}: {props.entry.value}
    </Typography>
  );
}
