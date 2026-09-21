import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { RouteData } from '../../../data/queries';
import type { RouteRendererProps } from './route-renderers.types';

type LazyRouteRenderer = LazyExoticComponent<ComponentType<RouteRendererProps>>;

const HomeRouteRenderer = lazy(() =>
  import('./home-route-renderer').then((module) => ({ default: module.HomeRouteRenderer })),
);

const AboutRouteRenderer = lazy(() =>
  import('./about-route-renderer').then((module) => ({ default: module.AboutRouteRenderer })),
);

const PortfolioRouteRenderer = lazy(() =>
  import('./portfolio-route-renderer').then((module) => ({
    default: module.PortfolioRouteRenderer,
  })),
);

const NowRouteRenderer = lazy(() =>
  import('./now-route-renderer').then((module) => ({ default: module.NowRouteRenderer })),
);

const CasesRouteRenderer = lazy(() =>
  import('./cases-route-renderer').then((module) => ({ default: module.CasesRouteRenderer })),
);

const ContactRouteRenderer = lazy(() =>
  import('./contact-route-renderer').then((module) => ({ default: module.ContactRouteRenderer })),
);

const FindingsRouteRenderer = lazy(() =>
  import('./findings-route-renderer').then((module) => ({ default: module.FindingsRouteRenderer })),
);

const ProjectsRouteRenderer = lazy(() =>
  import('./projects-route-renderer').then((module) => ({ default: module.ProjectsRouteRenderer })),
);

const WritingRouteRenderer = lazy(() =>
  import('./writing-route-renderer').then((module) => ({ default: module.WritingRouteRenderer })),
);

const CaseDetailRouteRenderer = lazy(() =>
  import('./case-detail-route-renderer').then((module) => ({
    default: module.CaseDetailRouteRenderer,
  })),
);

const CollectionDetailRouteRenderer = lazy(() =>
  import('./collection-detail-route-renderer').then((module) => ({
    default: module.CollectionDetailRouteRenderer,
  })),
);

const FindingDetailRouteRenderer = lazy(() =>
  import('./finding-detail-route-renderer').then((module) => ({
    default: module.FindingDetailRouteRenderer,
  })),
);

const FindingTypeRouteRenderer = lazy(() =>
  import('./finding-type-route-renderer').then((module) => ({
    default: module.FindingTypeRouteRenderer,
  })),
);

const ExperimentDetailRouteRenderer = lazy(() =>
  import('./experiment-detail-route-renderer').then((module) => ({
    default: module.ExperimentDetailRouteRenderer,
  })),
);

const ProjectDetailRouteRenderer = lazy(() =>
  import('./project-detail-route-renderer').then((module) => ({
    default: module.ProjectDetailRouteRenderer,
  })),
);

const SnippetDetailRouteRenderer = lazy(() =>
  import('./snippet-detail-route-renderer').then((module) => ({
    default: module.SnippetDetailRouteRenderer,
  })),
);

const TechnologyDetailRouteRenderer = lazy(() =>
  import('./technology-detail-route-renderer').then((module) => ({
    default: module.TechnologyDetailRouteRenderer,
  })),
);

const TopicDetailRouteRenderer = lazy(() =>
  import('./topic-detail-route-renderer').then((module) => ({
    default: module.TopicDetailRouteRenderer,
  })),
);

const WritingDetailRouteRenderer = lazy(() =>
  import('./writing-detail-route-renderer').then((module) => ({
    default: module.WritingDetailRouteRenderer,
  })),
);

const CollectionsRouteRenderer = lazy(() =>
  import('./collections-route-renderer').then((module) => ({
    default: module.CollectionsRouteRenderer,
  })),
);

const CreditsRouteRenderer = lazy(() =>
  import('./credits-route-renderer').then((module) => ({ default: module.CreditsRouteRenderer })),
);

const FollowRouteRenderer = lazy(() =>
  import('./follow-route-renderer').then((module) => ({ default: module.FollowRouteRenderer })),
);

const LicenseRouteRenderer = lazy(() =>
  import('./license-route-renderer').then((module) => ({ default: module.LicenseRouteRenderer })),
);

const ResumeRouteRenderer = lazy(() =>
  import('./resume-route-renderer').then((module) => ({ default: module.ResumeRouteRenderer })),
);

const SnippetsRouteRenderer = lazy(() =>
  import('./snippets-route-renderer').then((module) => ({ default: module.SnippetsRouteRenderer })),
);

const StatusRouteRenderer = lazy(() =>
  import('./status-route-renderer').then((module) => ({ default: module.StatusRouteRenderer })),
);

const TechnologiesRouteRenderer = lazy(() =>
  import('./technologies-route-renderer').then((module) => ({
    default: module.TechnologiesRouteRenderer,
  })),
);

const TopicsRouteRenderer = lazy(() =>
  import('./topics-route-renderer').then((module) => ({ default: module.TopicsRouteRenderer })),
);

export const routeRenderers: Record<RouteData['kind'], LazyRouteRenderer> = {
  home: HomeRouteRenderer,
  about: AboutRouteRenderer,
  portfolio: PortfolioRouteRenderer,
  now: NowRouteRenderer,
  cases: CasesRouteRenderer,
  contact: ContactRouteRenderer,
  findings: FindingsRouteRenderer,
  projects: ProjectsRouteRenderer,
  writing: WritingRouteRenderer,
  'case-detail': CaseDetailRouteRenderer,
  'collection-detail': CollectionDetailRouteRenderer,
  'finding-detail': FindingDetailRouteRenderer,
  'finding-type': FindingTypeRouteRenderer,
  'experiment-detail': ExperimentDetailRouteRenderer,
  'project-detail': ProjectDetailRouteRenderer,
  'snippet-detail': SnippetDetailRouteRenderer,
  'technology-detail': TechnologyDetailRouteRenderer,
  'topic-detail': TopicDetailRouteRenderer,
  'writing-detail': WritingDetailRouteRenderer,
  collections: CollectionsRouteRenderer,
  credits: CreditsRouteRenderer,
  follow: FollowRouteRenderer,
  license: LicenseRouteRenderer,
  resume: ResumeRouteRenderer,
  snippets: SnippetsRouteRenderer,
  status: StatusRouteRenderer,
  technologies: TechnologiesRouteRenderer,
  topics: TopicsRouteRenderer,
  'tools-index': StatusRouteRenderer,
  tool: StatusRouteRenderer,
};
