'use client';

import { SourcePreviewMetadataText } from '../../ui/semantic/SourcePreviewMetadataText';
import { useTranslations } from '@/i18n/compat';
import type { SourcePreviewMetadata } from './types';

type SourcePreviewListMetadataItemProps = { entry: SourcePreviewMetadata };

export function SourcePreviewListMetadataItem(props: SourcePreviewListMetadataItemProps) {
  const t = useTranslations('Pages.achados');

  return (
    <SourcePreviewMetadataText component="span">
      {t(`sourcePreview.fields.${props.entry.key}`)}: {props.entry.value}
    </SourcePreviewMetadataText>
  );
}
