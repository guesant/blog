import { ContentRichText } from '../../content/content-rich-text';
import { EmptyState } from '../../content/empty-state';
import type { ReferenceCollectionDetail } from '@portfolio/data/domain/types';
import type { CommonTranslator } from '@/i18n/compat-support';
import { CollectionReferenceItem } from './collection-reference-item';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ColecaoDetailContent2Frame } from '../../ui/semantic/ColecaoDetailContent2Frame';
import { ColecaoDetailContentFrame } from '../../ui/semantic/ColecaoDetailContentFrame';

type CollectionDetailSectionsProps = {
  collection: ReferenceCollectionDetail;
  tCommon: CommonTranslator;
};

export function CollectionDetailSections(props: CollectionDetailSectionsProps) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(props.collection.intro)}
        content={
          <ColecaoDetailContentFrame>
            <ContentRichText content={props.collection.intro ?? {}} />
          </ColecaoDetailContentFrame>
        }
      />
      <ConditionalContent
        condition={props.collection.items.length === 0}
        content={<EmptyState icon="problem">{props.tCommon('emptyCollections')}</EmptyState>}
      />
      <ConditionalContent
        condition={props.collection.items.length > 0}
        content={
          <ColecaoDetailContent2Frame>
            {props.collection.items.map((item) => (
              <CollectionReferenceItem key={item.reference.slug} item={item} />
            ))}
          </ColecaoDetailContent2Frame>
        }
      />
    </>
  );
}
