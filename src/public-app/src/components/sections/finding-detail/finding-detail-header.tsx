import { ContentActions } from '../../content/content-actions';
import { type BreadcrumbItem } from '../../navigation/breadcrumbs';
import type { Reference } from '@portfolio/data/domain/types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { ConditionalContent } from '../../primitives/conditional-content';
import { PageHeader } from '../../content/page-header';
import { FindingAuthorsText } from '../../ui/semantic/FindingAuthorsText';
import { FindingPublishedDateText } from '../../ui/semantic/FindingPublishedDateText';

type FindingDetailHeaderProps = {
  item: Reference;
  authors: string;
  breadcrumbTrail: BreadcrumbItem[];
  formattedPublishedDate: string | undefined;
  t: AchadosTranslator;
};

export function FindingDetailHeader(props: FindingDetailHeaderProps) {
  return (
    <PageHeader
      title={props.item.title}
      breadcrumbs={props.breadcrumbTrail}
      description={props.item.description}
      actions={
        <ContentActions
          title={props.item.title}
          url={props.item.url ?? `/findings/${props.item.slug}`}
          placement="hero"
        />
      }
      metadata={
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
      }
      variant="reading"
    />
  );
}
