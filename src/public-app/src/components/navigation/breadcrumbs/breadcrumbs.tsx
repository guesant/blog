'use client';

import { Breadcrumbs as UiBreadcrumbs, Button } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { Link as LocaleLink } from '../../../i18n/navigation';
import { Icon } from '../../primitives/icon';
import type { BreadcrumbsProps } from './types';
import { BreadcrumbTrailItem } from './breadcrumb-trail-item';

export function Breadcrumbs(props: BreadcrumbsProps) {
  const { trail } = props;

  const t = useTranslations('Nav');

  return (
    <UiBreadcrumbs aria-label={t('home')} separator="/" visualVariant="breadcrumbs">
      <Button
        component={LocaleLink}
        href="/"
        siteVariant="breadcrumb"
        startIcon={<Icon name="home" size={15} />}
      >
        {t('home')}
      </Button>
      {trail.map((item) => (
        <BreadcrumbTrailItem key={item.href ?? item.label} item={item} />
      ))}
    </UiBreadcrumbs>
  );
}
