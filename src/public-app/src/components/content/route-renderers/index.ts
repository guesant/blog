import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { RouteData } from '../../../data/queries';
import type { RouteRendererProps } from './route-renderers.types';
import { HomeRouteRenderer } from './home-route-renderer';

type LazyRouteRenderer = LazyExoticComponent<ComponentType<RouteRendererProps>>;

export type RouteRenderer = ComponentType<RouteRendererProps> | LazyRouteRenderer;

type RouteRendererModule = Record<string, ComponentType<RouteRendererProps>>;

const routeRendererModules = import.meta.glob<RouteRendererModule>([
  './*-route-renderer.tsx',
  '!./home-route-renderer.tsx',
]);

function loadRouteRenderer(file: string, exportName: string): LazyRouteRenderer {
  return lazy(async () => {
    const moduleLoader = routeRendererModules[`./${file}`];

    if (!moduleLoader) {
      throw new Error(`Route renderer module not found: ${file}`);
    }

    const module = await moduleLoader();

    const renderer = module[exportName];

    if (!renderer) {
      throw new Error(`Route renderer export not found: ${exportName}`);
    }

    return { default: renderer };
  });
}

const routeRendererDefinitions = {
  loading: ['loading-route-renderer.tsx', 'default'],
  about: ['about-route-renderer.tsx', 'AboutRouteRenderer'],
  portfolio: ['portfolio-route-renderer.tsx', 'PortfolioRouteRenderer'],
  now: ['now-route-renderer.tsx', 'NowRouteRenderer'],
  cases: ['cases-route-renderer.tsx', 'CasesRouteRenderer'],
  contact: ['contact-route-renderer.tsx', 'ContactRouteRenderer'],
  findings: ['findings-route-renderer.tsx', 'FindingsRouteRenderer'],
  projects: ['projects-route-renderer.tsx', 'ProjectsRouteRenderer'],
  writing: ['writing-route-renderer.tsx', 'WritingRouteRenderer'],
  'case-detail': ['case-detail-route-renderer.tsx', 'CaseDetailRouteRenderer'],
  'collection-detail': ['collection-detail-route-renderer.tsx', 'CollectionDetailRouteRenderer'],
  'finding-detail': ['finding-detail-route-renderer.tsx', 'FindingDetailRouteRenderer'],
  'finding-type': ['finding-type-route-renderer.tsx', 'FindingTypeRouteRenderer'],
  'experiment-detail': ['experiment-detail-route-renderer.tsx', 'ExperimentDetailRouteRenderer'],
  'project-detail': ['project-detail-route-renderer.tsx', 'ProjectDetailRouteRenderer'],
  'snippet-detail': ['snippet-detail-route-renderer.tsx', 'SnippetDetailRouteRenderer'],
  'technology-detail': ['technology-detail-route-renderer.tsx', 'TechnologyDetailRouteRenderer'],
  'topic-detail': ['topic-detail-route-renderer.tsx', 'TopicDetailRouteRenderer'],
  'writing-detail': ['writing-detail-route-renderer.tsx', 'WritingDetailRouteRenderer'],
  collections: ['collections-route-renderer.tsx', 'CollectionsRouteRenderer'],
  credits: ['credits-route-renderer.tsx', 'CreditsRouteRenderer'],
  follow: ['follow-route-renderer.tsx', 'FollowRouteRenderer'],
  license: ['license-route-renderer.tsx', 'LicenseRouteRenderer'],
  resume: ['resume-route-renderer.tsx', 'ResumeRouteRenderer'],
  snippets: ['snippets-route-renderer.tsx', 'SnippetsRouteRenderer'],
  status: ['status-route-renderer.tsx', 'StatusRouteRenderer'],
  technologies: ['technologies-route-renderer.tsx', 'TechnologiesRouteRenderer'],
  topics: ['topics-route-renderer.tsx', 'TopicsRouteRenderer'],
} satisfies Record<Exclude<RouteData['kind'], 'home'>, readonly [string, string]>;

const lazyRouteRenderers = Object.fromEntries(
  Object.entries(routeRendererDefinitions).map(([kind, [file, exportName]]) => [
    kind,
    loadRouteRenderer(file, exportName),
  ]),
) as Record<Exclude<RouteData['kind'], 'home'>, LazyRouteRenderer>;

export const routeRenderers = {
  ...lazyRouteRenderers,
  home: HomeRouteRenderer,
} as Record<RouteData['kind'], RouteRenderer>;
