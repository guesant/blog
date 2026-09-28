import { Typography } from '../../ui';
import { ContentActions } from '../../content/content-actions';
import { type BreadcrumbItem } from '../../navigation/breadcrumbs';
import type { Reference } from '@portfolio/data/domain/types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { ConditionalContent } from '../../primitives/conditional-content';
import { PageHeader } from '../../content/page-header';

type AchadoDetailHeaderProps = {
  item: Reference;
  authors: string;
  breadcrumbTrail: BreadcrumbItem[];
  formattedPublishedDate: string | undefined;
  t: AchadosTranslator;
};

export function AchadoDetailHeader(props: AchadoDetailHeaderProps) {
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
            content={<Typography visualVariant="achadoDetailContent3">{props.authors}</Typography>}
          />
          <ConditionalContent
            condition={Boolean(props.formattedPublishedDate)}
            content={
              <Typography visualVariant="achadoDetailContent4">
                {props.t('publishedOn', { date: props.formattedPublishedDate ?? '' })}
              </Typography>
            }
          />
        </>
      }
      layout="findingDetail"
    />
  );
}
