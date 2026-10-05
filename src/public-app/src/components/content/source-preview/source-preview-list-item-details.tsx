'use client';

import { ConditionalContent } from '../../primitives/conditional-content';
import { useTranslations } from '@/i18n/compat';
import { SourcePreviewListMetadata } from './source-preview-list-metadata';
import { SourcePreviewListItemHeader } from './source-preview-list-item-header';
import { SourcePreviewListItemText } from './source-preview-list-item-text';
import type { SourcePreviewListItemDetailsProps } from './source-preview-list-item-details.types';
import { SourcePreviewEditorialItemFrame } from '../../ui/semantic/SourcePreviewEditorialItemFrame';

export function SourcePreviewListItemDetails(props: SourcePreviewListItemDetailsProps) {
  const defaultT = useTranslations('Pages.achados');

  const t = props.t ?? defaultT;

  return (
    <SourcePreviewEditorialItemFrame>
      <SourcePreviewListItemHeader data={props.data} onKindClick={props.onKindClick} t={t} />
      <SourcePreviewListItemText data={props.data} />
      <ConditionalContent condition={props.data.metadata.length > 0}>
        <SourcePreviewListMetadata entries={props.data.metadata} />
      </ConditionalContent>
    </SourcePreviewEditorialItemFrame>
  );
}
