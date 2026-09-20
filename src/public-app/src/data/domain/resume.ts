type TrajectoryItem = {
  hidden?: boolean;
  includeInResume?: boolean;
  role: string;
  organization: string;
  period: string;
  highlights: string[];
};

type ProfileMilestone = {
  hidden?: boolean;
  year: string;
  title: string;
  description: string;
};

type ResumeSkillGroup = {
  label: string;
  items: string[];
};

type LanguageProficiency = {
  code: string;
  name: string;
  proficiency?: 'native' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
};

type LeadershipItem = {
  hidden?: boolean;
  role: string;
  organization: string;
  period: string;
  highlights: string[];
};

type EducationItem = {
  hidden?: boolean;
  institution: string;
  location: string;
  degree: string;
  period: string;
};

type CredentialItem = {
  hidden?: boolean;
  name: string;
  issuer: string;
  url?: string;
  period: string;
  credentialId?: string;
};

type PublicationItem = CredentialItem & {
  includeInPdf?: boolean;
};

type RecommendationItem = {
  hidden?: boolean;
  author: string;
  role: string;
  quote: string;
  url?: string;
  period?: string;
};

type TechnicalProductionItem = {
  hidden?: boolean;
  includeInPdf?: boolean;
  name: string;
  kind: 'software' | 'library' | 'tool' | 'dataset' | 'other';
  description?: string;
  url?: string;
  period: string;
  projectHref?: string;
};

type EventItem = {
  hidden?: boolean;
  includeInPdf?: boolean;
  name: string;
  role: 'speaker' | 'organizer' | 'panelist' | 'attendee' | 'other';
  talkTitle?: string;
  location?: string;
  period: string;
  url?: string;
};

type AwardItem = {
  hidden?: boolean;
  includeInPdf?: boolean;
  name: string;
  issuer: string;
  description?: string;
  period: string;
  url?: string;
};

export type ContentReference = string | { item: string };

export type ResumeContent = {
  summary: string;
  skills: ResumeSkillGroup[];
  languages: LanguageProficiency[];
  selectedCases: ContentReference[];
  leadership: LeadershipItem[];
  education: EducationItem[];
  certificates: CredentialItem[];
  certifications: CredentialItem[];
  publications: PublicationItem[];
  recommendations: RecommendationItem[];
  technicalProductions: TechnicalProductionItem[];
  events: EventItem[];
  awards: AwardItem[];
};

export type Profile = {
  name: string;
  birthDate?: string;
  title: string;
  location: string;
  birthCity?: string;
  description: string;
  interests: string;
  learning: string;
  personalInterests: string[];
  trajectory: TrajectoryItem[];
  milestones: ProfileMilestone[];
};
