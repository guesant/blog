'use client';

import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import { ContentActions } from '../../content/content-actions';
import { useContentActionsVisibility } from '../../content/use-content-actions-visibility';
import type { CollectionDetailPageProps } from './types';
import { CollectionDetailSections } from './collection-detail-sections';

export function CollectionDetailPage(props: CollectionDetailPageProps) {
  const { collection } = props;

  const tNav = useTranslations('Nav');

  const tCommon = useTranslations('Common');

  const actionsVisible = useContentActionsVisibility();

  return (
    <>
      <PageHeader
        title={collection.title}
        description={collection.description}
        actions={
          actionsVisible ? (
            <ContentActions
              title={collection.title}
              url={collection.url ?? `/collections/${collection.slug}`}
              body={collection.intro}
              placement="hero"
            />
          ) : undefined
        }
        breadcrumbs={[
          { label: tNav('collections'), href: '/collections' },
          { label: collection.title },
        ]}
        variant="showcase"
      />
      <CollectionDetailSections collection={collection} tCommon={tCommon} />
    </>
  );
}
