import { Breadcrumbs as UiBreadcrumbs, Button, Box } from '../../ui';
import { useLocale, useTranslations } from '@/i18n/compat';
import { localizedPath } from '../../../i18n/navigation';
import { Icon } from '../../primitives/icon';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { BreadcrumbsProps } from './types';
import { BreadcrumbTrailItem } from './breadcrumb-trail-item';

export function Breadcrumbs(props: BreadcrumbsProps) {
  const { trail } = props;

  const locale = useLocale();

  const t = useTranslations('Nav');

  const breadcrumbs = (
    <UiBreadcrumbs aria-label={t('home')} separator="/" visualVariant="breadcrumbs">
      <Button
        component="a"
        href={localizedPath('/', locale)}
        siteVariant="breadcrumb-home"
        startIcon={<Icon name="home" size={15} />}
      >
        {t('home')}
      </Button>
      {trail.map((item) => (
        <BreadcrumbTrailItem key={item.href ?? item.label} item={item} locale={locale} />
      ))}
    </UiBreadcrumbs>
  );

  return (
    <ConditionalContent
      condition={Boolean(props.containerVisualVariant)}
      content={<Box visualVariant={props.containerVisualVariant}>{breadcrumbs}</Box>}
      fallback={breadcrumbs}
    />
  );
}
