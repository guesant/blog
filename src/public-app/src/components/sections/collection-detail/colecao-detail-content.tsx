'use client';

import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import { ContentActions } from '../../content/content-actions';
import type { ColecaoDetailContentProps } from './types';
import { CollectionDetailSections } from './collection-detail-sections';

export function ColecaoDetailContent(props: ColecaoDetailContentProps) {
  const { collection } = props;

  const tPages = useTranslations('Pages.collections');

  const tNav = useTranslations('Nav');

  return (
    <>
      <PageHeader
        eyebrow={tPages('eyebrow')}
        title={collection.title}
        description={collection.description}
        actions={
          <ContentActions
            title={collection.title}
            url={collection.url ?? `/collections/${collection.slug}`}
            body={collection.intro}
            placement="hero"
          />
        }
        breadcrumbs={[{ label: tNav('achados'), href: '/findings' }, { label: collection.title }]}
      />
      <CollectionDetailSections collection={collection} tNav={tNav} />
    </>
  );
}
