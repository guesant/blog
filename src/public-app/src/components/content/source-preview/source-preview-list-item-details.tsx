'use client';

import { Box } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { useTranslations } from '@/i18n/compat';
import { SourcePreviewListMetadata } from './source-preview-list-metadata';
import { SourcePreviewListItemAction } from './source-preview-list-item-action';
import { SourcePreviewListItemHeader } from './source-preview-list-item-header';
import { SourcePreviewListItemText } from './source-preview-list-item-text';
import type { SourcePreviewListItemDetailsProps } from './source-preview-list-item-details.types';
import { sourcePreviewVariantNames } from './source-preview-variant';

export function SourcePreviewListItemDetails(props: SourcePreviewListItemDetailsProps) {
  const defaultT = useTranslations('Pages.achados');

  const t = props.t ?? defaultT;

  return (
    <Box visualVariant={`sourcePreviewDetails${sourcePreviewVariantNames[props.variant]}`}>
      <SourcePreviewListItemHeader data={props.data} onKindClick={props.onKindClick} t={t} />
      <SourcePreviewListItemText data={props.data} variant={props.variant} />
      <ConditionalContent condition={props.data.metadata.length > 0}>
        <SourcePreviewListMetadata entries={props.data.metadata} />
      </ConditionalContent>
      <SourcePreviewListItemAction data={props.data} t={t} variant={props.variant} />
    </Box>
  );
}
