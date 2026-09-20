import type { RouteRenderer } from './route-renderers.types';
import { AboutPageContent } from '../../sections/about';
import { CasesPageContent } from '../../sections/cases';
import { ContactPageContent } from '../../sections/contact';
import { FindingsSection } from '../../sections/findings';
import { HomeSection } from '../../sections/home';
import { NowPageContent } from '../../sections/now';
import { PortfolioPageContent } from '../../sections/portfolio';
import { ProjectsPageContent } from '../../sections/projects';
import { WritingSection } from '../../sections/writing';

export const primaryRouteRenderers: Record<string, RouteRenderer> = {
  home: (data) =>
    data.kind === 'home' ? (
      <HomeSection
        content={data.content}
        writings={data.writings}
        findings={data.findings}
        collections={data.collections}
      />
    ) : null,
  about: (data) =>
    data.kind === 'about' ? <AboutPageContent page={data.page} profile={data.profile} /> : null,
  portfolio: (data) =>
    data.kind === 'portfolio' ? (
      <PortfolioPageContent
        page={data.page}
        profile={data.profile}
        cases={data.cases}
        projects={data.projects}
        experiments={data.experiments}
      />
    ) : null,
  now: (data) => (data.kind === 'now' ? <NowPageContent page={data.page} /> : null),
  cases: (data) =>
    data.kind === 'cases' ? <CasesPageContent page={data.page} items={data.items} /> : null,
  contact: (data) =>
    data.kind === 'contact' ? <ContactPageContent page={data.page} site={data.site} /> : null,
  findings: (data) =>
    data.kind === 'findings' ? <FindingsSection copy={data.page} {...data.request} /> : null,
  projects: (data) =>
    data.kind === 'projects' ? (
      <ProjectsPageContent
        page={data.page}
        projects={data.projects}
        experiments={data.experiments}
      />
    ) : null,
  writing: (data) =>
    data.kind === 'writing' ? (
      <WritingSection
        writings={data.writings}
        findings={data.findings}
        collections={data.collections}
        copy={data.page}
      />
    ) : null,
};
