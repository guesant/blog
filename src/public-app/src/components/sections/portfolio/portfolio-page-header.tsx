import { Typography } from '../../ui';
import { PageHeader } from '../../content/page-header';
import type { NavTranslator } from '@/i18n/compat-support';
import type { PortfolioPageContentProps } from './types';
import { PortfolioAvailabilityCard } from './ui/availability-card';
import { PortfolioFocus } from './ui/focus';

type PortfolioPageHeaderProps = Pick<PortfolioPageContentProps, 'page' | 'profile'> & {
  tNav: NavTranslator;
};

export function PortfolioPageHeader(props: PortfolioPageHeaderProps) {
  return (
    <>
      <PageHeader
        title={props.profile.name}
        description={props.page.heroExperience}
        breadcrumbs={[{ label: props.tNav('portfolio') }]}
      />
      <PortfolioAvailabilityCard>
        <Typography variant="overline" color="text.secondary">
          {props.page.availableLabel}
        </Typography>
        <PortfolioFocus>{props.page.heroCurrentFocus}</PortfolioFocus>
      </PortfolioAvailabilityCard>
    </>
  );
}
