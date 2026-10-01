import { ContentRichText } from '../../content/content-rich-text';
import { EmptyState } from '../../content/empty-state';
import type { ReferenceCollectionDetail } from '@portfolio/data/domain/types';
import type { CommonTranslator } from '@/i18n/compat-support';
import { CollectionReferenceItem } from './collection-reference-item';
import { ConditionalContent } from '../../primitives/conditional-content';
import { CollectionReferenceListFrame } from '../../ui/semantic/CollectionReferenceListFrame';
import { CollectionIntroductionFrame } from '../../ui/semantic/CollectionIntroductionFrame';

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
          <CollectionIntroductionFrame>
            <ContentRichText content={props.collection.intro ?? {}} />
          </CollectionIntroductionFrame>
        }
      />
      <ConditionalContent
        condition={props.collection.items.length === 0}
        content={<EmptyState icon="problem">{props.tCommon('emptyCollections')}</EmptyState>}
      />
      <ConditionalContent
        condition={props.collection.items.length > 0}
        content={
          <CollectionReferenceListFrame>
            {props.collection.items.map((item) => (
              <CollectionReferenceItem key={item.reference.slug} item={item} />
            ))}
          </CollectionReferenceListFrame>
        }
      />
    </>
  );
}
