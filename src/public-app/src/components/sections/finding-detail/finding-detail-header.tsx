'use client';

import { ContentActions } from '../../content/content-actions';
import { useContentActionsVisibility } from '../../content/use-content-actions-visibility';
import { type BreadcrumbItem } from '../../navigation/breadcrumbs';
import type { Reference } from '@portfolio/data/domain/types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { PageHeader } from '../../content/page-header';
import { FindingDetailMetadata } from './finding-detail-metadata';

type FindingDetailHeaderProps = {
  item: Reference;
  authors: string;
  breadcrumbTrail: BreadcrumbItem[];
  formattedPublishedDate: string | undefined;
  t: AchadosTranslator;
};

export function FindingDetailHeader(props: FindingDetailHeaderProps) {
  const actionsVisible = useContentActionsVisibility();

  return (
    <PageHeader
      title={props.item.title}
      breadcrumbs={props.breadcrumbTrail}
      description={props.item.description}
      actions={
        actionsVisible ? (
          <ContentActions
            title={props.item.title}
            url={props.item.url ?? `/findings/${props.item.slug}`}
            placement="hero"
          />
        ) : undefined
      }
      metadata={
        props.authors || props.formattedPublishedDate ? (
          <FindingDetailMetadata
            authors={props.authors}
            formattedPublishedDate={props.formattedPublishedDate}
            t={props.t}
          />
        ) : undefined
      }
      variant="reading"
    />
  );
}
