import type { RichTextContent, TechnologyBadge, WithSeo } from './content';
import type { ContentReference } from './resume';

export type PageIntroduction = WithSeo & {
  title: string;
  description: string;
};

export type HomePageCopy = WithSeo & {
  title: string;
  description: string;
  recurringTechnologies?: TechnologyBadge[];
  featuredCases: ContentReference[];
  featuredProjects: ContentReference[];
  featuredWriting: ContentReference[];
  heroIdentity: string;
  heroExperience: string;
  heroCurrentFocus: string;
  availableLabel: string;
  unavailableLabel: string;
  workTitle: string;
  workDescription: string;
  projectsTitle: string;
  projectsDescription: string;
  experimentsSummary: string;
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

export type ProjectsPageCopy = PageIntroduction & {
  selectedLabel: string;
  archiveLabel: string;
  experimentsTitle: string;
};

export type ResumePageCopy = WithSeo & {
  title: string;
  description: string;
};
