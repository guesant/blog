import {
  SiBluesky,
  SiGithub,
  SiGitlab,
  SiGooglescholar,
  SiInstagram,
  SiMastodon,
  SiOrcid,
  SiResearchgate,
} from '@icons-pack/react-simple-icons';
import type { IconType } from '@icons-pack/react-simple-icons';

export type ProfileBrandName =
  | 'bluesky'
  | 'github'
  | 'gitlab'
  | 'googlescholar'
  | 'instagram'
  | 'mastodon'
  | 'orcid'
  | 'researchgate';

export const profileBrands = {
  bluesky: SiBluesky,
  github: SiGithub,
  gitlab: SiGitlab,
  googlescholar: SiGooglescholar,
  instagram: SiInstagram,
  mastodon: SiMastodon,
  orcid: SiOrcid,
  researchgate: SiResearchgate,
} satisfies Record<ProfileBrandName, IconType>;
