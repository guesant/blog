import { Box, Typography } from '../../ui';
import { ContentActions } from '../../content/content-actions';
import { Breadcrumbs, type BreadcrumbItem } from '../../navigation/breadcrumbs';
import type { Reference } from '@portfolio/data/domain/types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { ConditionalContent } from '../../primitives/conditional-content';

type AchadoDetailHeaderProps = {
  item: Reference;
  authors: string;
  breadcrumbTrail: BreadcrumbItem[];
  formattedPublishedDate: string | undefined;
  t: AchadosTranslator;
};

export function AchadoDetailHeader(props: AchadoDetailHeaderProps) {
  return (
    <Box component="header" visualVariant="achadoDetailContent2">
      <Breadcrumbs trail={props.breadcrumbTrail} />
      <Typography component="h1" visualVariant="achadoDetailContent">
        {props.item.title}
      </Typography>
      <ContentActions
        title={props.item.title}
        url={props.item.url ?? `/findings/${props.item.slug}`}
        placement="hero"
      />
      <Typography visualVariant="achadoDetailContent2">{props.item.description}</Typography>
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
    </Box>
  );
}
