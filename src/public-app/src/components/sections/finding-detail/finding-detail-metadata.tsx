import type { AchadosTranslator } from '@/i18n/compat-support';
import { ConditionalContent } from '../../primitives/conditional-content';
import { FindingAuthorsText } from '../../ui/semantic/FindingAuthorsText';
import { FindingPublishedDateText } from '../../ui/semantic/FindingPublishedDateText';

type FindingDetailMetadataProps = {
  authors: string;
  formattedPublishedDate: string | undefined;
  t: AchadosTranslator;
};

export function FindingDetailMetadata(props: FindingDetailMetadataProps) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(props.authors)}
        content={<FindingAuthorsText>{props.authors}</FindingAuthorsText>}
      />
      <ConditionalContent
        condition={Boolean(props.formattedPublishedDate)}
        content={
          <FindingPublishedDateText>
            {props.t('publishedOn', { date: props.formattedPublishedDate ?? '' })}
          </FindingPublishedDateText>
        }
      />
    </>
  );
}
