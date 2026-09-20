'use client';

import { Link, Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import { NavLink } from '../../primitives/nav-link';
import type { PortfolioPageContentProps } from './types';
import { PortfolioAction } from './ui/action';
import { PortfolioAvailabilityCard } from './ui/availability-card';
import { PortfolioFocus } from './ui/focus';
import { PortfolioCaseSection } from './portfolio-case-section';
import { PortfolioProjectsSection } from './portfolio-projects-section';

export function PortfolioPageContent(props: PortfolioPageContentProps) {
  const { page, profile, cases, projects, experiments } = props;

  const tNav = useTranslations('Nav');

  const tHome = useTranslations('Home');

  return (
    <>
      <PageHeader
        eyebrow={page.heroIdentity}
        title={profile.name}
        description={page.heroExperience}
        breadcrumbs={[{ label: tNav('portfolio') }]}
      />
      <PortfolioAvailabilityCard>
        <Typography variant="overline" color="text.secondary">
          {page.availableLabel}
        </Typography>
        <PortfolioFocus>{page.heroCurrentFocus}</PortfolioFocus>
      </PortfolioAvailabilityCard>
      <PortfolioCaseSection page={page} cases={cases} />
      <PortfolioProjectsSection page={page} projects={projects} experiments={experiments} />
      <PortfolioAction>
        <Link component={NavLink} href="/resume">
          {tHome('experienceAction')}
        </Link>
      </PortfolioAction>
    </>
  );
}
