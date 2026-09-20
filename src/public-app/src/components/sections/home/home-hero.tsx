'use client';

import { TechnicalGrid } from '../../primitives/technical-grid';
import type { HomeHeroProps } from './types';
import { Eyebrow } from './ui/eyebrow';
import { HomeAvailability } from './ui/home-availability';
import { HomeHeroActions } from './ui/home-hero-actions';
import { HomeHeroContent } from './ui/home-hero-content';
import { HomeHeroSurface } from './ui/home-hero-surface';
import { HomeHeroText } from './ui/home-hero-text';

export function HomeHero(props: HomeHeroProps) {
  const { page, profile, showContact, workTarget, t } = props;

  return (
    <HomeHeroSurface showContact={showContact}>
      <TechnicalGrid />
      <HomeHeroContent>
        <Eyebrow>{profile.title.toUpperCase()}</Eyebrow>
        <HomeHeroText kind="title">{profile.name}</HomeHeroText>
        <HomeHeroText kind="location">{profile.location}</HomeHeroText>
        <HomeHeroText kind="experience">{page.heroExperience}</HomeHeroText>
        <HomeHeroText kind="focus">{page.heroCurrentFocus}</HomeHeroText>
        <HomeHeroActions
          site={props.site}
          showContact={showContact}
          workTarget={workTarget}
          t={t}
        />
      </HomeHeroContent>
      <HomeAvailability page={page} showContact={showContact} />
    </HomeHeroSurface>
  );
}
