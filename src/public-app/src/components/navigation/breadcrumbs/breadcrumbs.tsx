import { BreadcrumbsFrame } from '../../ui/semantic/BreadcrumbsFrame';
import { useLocale, useTranslations } from '@/i18n/compat';
import { localizedPath } from '../../../i18n/navigation';
import { Icon } from '../../primitives/icon';
import type { BreadcrumbsProps } from './types';
import { BreadcrumbTrailItem } from './breadcrumb-trail-item';
import { BreadcrumbHomeButton } from '../../ui/semantic/BreadcrumbHomeButton';

export function Breadcrumbs(props: BreadcrumbsProps) {
  const { trail } = props;

  const locale = useLocale();

  const t = useTranslations('Nav');

  const breadcrumbs = (
    <BreadcrumbsFrame aria-label={t('home')} separator="/">
      <BreadcrumbHomeButton
        component="a"
        href={localizedPath('/', locale)}

        startIcon={<Icon name="home" size={15} />}
      >
        {t('home')}
      </BreadcrumbHomeButton>
      {trail.map((item) => (
        <BreadcrumbTrailItem key={item.href ?? item.label} item={item} locale={locale} />
      ))}
    </BreadcrumbsFrame>
  );

  return breadcrumbs;
}
