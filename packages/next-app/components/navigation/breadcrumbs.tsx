'use client';

import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { Link as LocaleLink } from '../../i18n/navigation';
import { Icon } from '../primitives/icon';

export type BreadcrumbItem = { label: string; href?: string };

type BreadcrumbsProps = { trail: BreadcrumbItem[] };

export function Breadcrumbs(props: BreadcrumbsProps) {
  const { trail } = props;
  const t = useTranslations('Nav');

  return (
    <MuiBreadcrumbs
      aria-label={t('home')}
      separator="/"
      sx={{
        mb: { xs: 2.5, md: 3 },
        fontSize: '0.8125rem',
        color: 'text.secondary',
        '& .MuiBreadcrumbs-li': { display: 'flex', alignItems: 'center' },
        '& .MuiBreadcrumbs-separator': { mx: 0.75, color: 'text.disabled' },
      }}
    >
      <Link
        component={LocaleLink}
        href="/"
        color="text.secondary"
        underline="hover"
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
      >
        <Icon name="home" size={15} />
        {t('home')}
      </Link>
      {trail.map((item) =>
        item.href ? (
          <Link
            key={item.href}
            component={LocaleLink}
            href={item.href}
            variant="body2"
            color="text.secondary"
            underline="hover"
          >
            {item.label}
          </Link>
        ) : (
          <Typography key={item.label} variant="body2" color="text.primary" aria-current="page">
            {item.label}
          </Typography>
        ),
      )}
    </MuiBreadcrumbs>
  );
}
