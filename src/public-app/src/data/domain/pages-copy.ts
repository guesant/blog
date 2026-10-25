import type { RichTextContent, TechnologyBadge, WithOgImage } from './content';

export type PageIntroduction = WithOgImage & {
  title: string;
  description: string;
};

export type HomePageCopy = WithOgImage & {
  title: string;
  description: string;
  recurringTechnologies?: TechnologyBadge[];
  heroIdentity: string;
  heroExperience: string;
  heroCurrentFocus: string;
  availableLabel: string;
  unavailableLabel: string;
  workTitle: string;
  workDescription: string;
  experienceTitle: string;
  experienceDescription: string;
  currentlyExploringLabel: string;
  recurringTechnologiesLabel: string;
  writingTitle: string;
  writingDescription: string;
  contactTitle: string;
  contactDescription: string;
};

export type AboutPageCopy = PageIntroduction & {
  introduction?: RichTextContent;
  lead: string;
  context: string;
  timelineTitle?: string;
  timelineDescription?: RichTextContent;
  story?: RichTextContent;
  sections?: AboutEditorialSection[];
};

export type AboutEditorialSection = {
  id: string;
  title?: string;
  body: RichTextContent;
};
