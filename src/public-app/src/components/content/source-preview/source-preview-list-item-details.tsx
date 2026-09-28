'use client';

import { ConditionalContent } from '../../primitives/conditional-content';
import { useTranslations } from '@/i18n/compat';
import { SourcePreviewListMetadata } from './source-preview-list-metadata';
import { SourcePreviewListItemAction } from './source-preview-list-item-action';
import { SourcePreviewListItemHeader } from './source-preview-list-item-header';
import { SourcePreviewListItemText } from './source-preview-list-item-text';
import type { SourcePreviewListItemDetailsProps } from './source-preview-list-item-details.types';
import { SourcePreviewDetailsFeedFrame } from '../../ui/semantic/SourcePreviewDetailsFeedFrame';

export function SourcePreviewListItemDetails(props: SourcePreviewListItemDetailsProps) {
  const defaultT = useTranslations('Pages.achados');

  const t = props.t ?? defaultT;

  return (
    <SourcePreviewDetailsFeedFrame>
      <SourcePreviewListItemHeader data={props.data} onKindClick={props.onKindClick} t={t} />
      <SourcePreviewListItemText data={props.data} />
      <ConditionalContent condition={props.data.metadata.length > 0}>
        <SourcePreviewListMetadata entries={props.data.metadata} />
      </ConditionalContent>
      <SourcePreviewListItemAction data={props.data} t={t} />
    </SourcePreviewDetailsFeedFrame>
  );
}
