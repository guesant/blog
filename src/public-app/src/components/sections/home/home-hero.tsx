'use client';

import { PageHeader } from '../../content/page-header';
import { HomeIntroText } from '../../ui/semantic/HomeIntroText';
import { HomeHeroDescriptionFrame } from '../../ui/semantic/HomeHeroDescriptionFrame';
import { TechnicalGrid } from '../../primitives/technical-grid';
import type { HomeHeroProps } from './types';
import { HomeAvailability } from './ui/home-availability';
import { HomeHeroActions } from './ui/home-hero-actions';
import { HomeHeroContent } from './ui/home-hero-content';
import { HomeHeroSurface } from './ui/home-hero-surface';

export function HomeHero(props: HomeHeroProps) {
  const { page, profile, showContact, showAvailability, workTarget, t } = props;

  return (
    <HomeHeroSurface showContact={showContact}>
      <TechnicalGrid />
      <HomeHeroContent>
        <PageHeader
          title={profile.name}
          description={
            <HomeHeroDescriptionFrame>
              <HomeIntroText component="p">{page.heroExperience}</HomeIntroText>
              <HomeIntroText component="p">{page.heroCurrentFocus}</HomeIntroText>
            </HomeHeroDescriptionFrame>
          }
          actions={
            <HomeHeroActions
              site={props.site}
              showContact={showContact}
              workTarget={workTarget}
              t={t}
            />
          }
          variant="showcase"
        />
      </HomeHeroContent>
      <HomeAvailability page={page} showAvailability={showAvailability} />
    </HomeHeroSurface>
  );
}
