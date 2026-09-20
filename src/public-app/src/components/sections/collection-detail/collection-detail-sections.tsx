import { Box } from '../../ui';
import { ContentRichText } from '../../content/content-rich-text';
import { EmptyState } from '../../content/empty-state';
import type { ReferenceCollectionDetail } from '@portfolio/data/domain/types';
import type { useTranslations } from '@/i18n/compat';
import { CollectionReferenceItem } from './collection-reference-item';
import { ConditionalContent } from '../../primitives/conditional-content';

type CollectionDetailSectionsProps = {
  collection: ReferenceCollectionDetail;
  tNav: ReturnType<typeof useTranslations>;
};

export function CollectionDetailSections(props: CollectionDetailSectionsProps) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(props.collection.intro)}
        content={
          <Box visualVariant="colecaoDetailContent">
            <ContentRichText content={props.collection.intro ?? {}} />
          </Box>
        }
      />
      <ConditionalContent
        condition={props.collection.items.length === 0}
        content={<EmptyState icon="problem">{props.tNav('emptyCollections')}</EmptyState>}
      />
      <ConditionalContent
        condition={props.collection.items.length > 0}
        content={
          <Box visualVariant="colecaoDetailContent2">
            {props.collection.items.map((item) => (
              <CollectionReferenceItem key={item.reference.slug} item={item} />
            ))}
          </Box>
        }
      />
    </>
  );
}
