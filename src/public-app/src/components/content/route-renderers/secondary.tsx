import type { RouteRenderer } from './route-renderers.types';
import { CollectionsSection } from '../../sections/collections';
import { CreditsPageContent } from '../../sections/credits';
import { FollowPageContent } from '../../sections/follow';
import { LicensePageContent } from '../../sections/license';
import { ResumePageContent } from '../../sections/resume';
import { SnippetsPageContent } from '../../sections/snippets';
import { StatusPage } from '../../sections/status';
import { TechnologiesPageContent } from '../../sections/technologies';
import { TopicosPageContent } from '../../sections/topics';

export const secondaryRouteRenderers: Record<string, RouteRenderer> = {
  collections: (data) =>
    data.kind === 'collections' ? (
      <CollectionsSection
        writings={data.writings}
        findings={data.findings}
        collections={data.collections}
        copy={data.page}
      />
    ) : null,
  credits: (data) =>
    data.kind === 'credits' ? <CreditsPageContent content={data.content} /> : null,
  follow: (data) => (data.kind === 'follow' ? <FollowPageContent page={data.page} /> : null),
  license: (data) =>
    data.kind === 'license' ? (
      <LicensePageContent page={data.page} emailChallenge={data.site.contact.emailChallenge} />
    ) : null,
  resume: (data) =>
    data.kind === 'resume' ? (
      <ResumePageContent content={data.content} pdfUrls={data.pdfUrls} />
    ) : null,
  snippets: (data) =>
    data.kind === 'snippets' ? <SnippetsPageContent snippets={data.snippets} /> : null,
  status: (data) =>
    data.kind === 'status' ? (
      <StatusPage kind={data.status} sourceRepositoryUrl={data.sourceRepositoryUrl} />
    ) : null,
  technologies: (data) =>
    data.kind === 'technologies' ? (
      <TechnologiesPageContent technologies={data.technologies} />
    ) : null,
  topics: (data) => (data.kind === 'topics' ? <TopicosPageContent topics={data.topics} /> : null),
};
