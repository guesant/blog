import type { RichTextContent, WithSeo } from './content';
import type { ContentReference } from './resume';

type InterfaceMessage = string | { [key: string]: InterfaceMessage };

export type InterfaceMessages = { [key: string]: InterfaceMessage };

export type PageIntroduction = WithSeo & {
  eyebrow: string;
  title: string;
  description: string;
};

export type HomePageCopy = WithSeo & {
  featuredCases: ContentReference[];
  featuredProjects: ContentReference[];
  featuredWriting: ContentReference[];
  heroIdentity: string;
  heroExperience: string;
  heroCurrentFocus: string;
  availableLabel: string;
  unavailableLabel: string;
  workEyebrow: string;
  workTitle: string;
  workDescription: string;
  projectsEyebrow: string;
  projectsTitle: string;
  projectsDescription: string;
  experimentsSummary: string;
  experienceEyebrow: string;
  experienceTitle: string;
  experienceDescription: string;
  currentlyExploringLabel: string;
  recurringTechnologiesLabel: string;
  writingEyebrow: string;
  writingTitle: string;
  writingDescription: string;
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
};

export type AboutPageCopy = PageIntroduction & {
  lead: string;
  context: string;
  storyEyebrow?: string;
  storyTitle?: string;
  story?: RichTextContent;
};

export type ProjectsPageCopy = PageIntroduction & {
  selectedLabel: string;
  archiveLabel: string;
  experimentsTitle: string;
};

export type ResumePageCopy = WithSeo & {
  title: string;
  description: string;
};
