import type {
  AboutEditorialSection,
  AboutPageCopy,
  Profile,
  RichTextContent,
} from '@portfolio/data/domain/types';

export type AboutPageContentProps = {
  page: AboutPageCopy;
  profile: Profile;
};

export type AboutEditorialBodyProps = {
  page: AboutPageCopy;
  profile: Profile;
};

export type AboutIntroductionProps = {
  content: RichTextContent;
};

export type AboutTimelineProps = {
  profile: Profile;
  title?: string;
  description?: RichTextContent;
  hasFollowingContent: boolean;
};

export type AboutTimelineHeadingProps = {
  title?: string;
  description?: RichTextContent;
};

export type AboutTimelineItemsProps = {
  items: Profile['milestones'];
};

export type AboutTimelineItemProps = {
  item: Profile['milestones'][number];
};

export type AboutEditorialSectionsProps = {
  sections: AboutEditorialSection[];
};

export type AboutEditorialSectionProps = {
  section: AboutEditorialSection;
};
