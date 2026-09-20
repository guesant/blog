import type { RouteData } from '../../data/queries';
import type { RouteMetadata } from './splat-support';
import { articleMetadata } from './splat-metadata-article';
import { defaultMetadata } from './splat-metadata-default';
import { kindMetadata } from './splat-metadata-kind';
import { pageMetadata } from './splat-metadata-page';

type MetadataResolver = (data: RouteData) => RouteMetadata;

const metadataResolvers: Partial<Record<RouteData['kind'], MetadataResolver>> = {
  home: (data) =>
    data.kind === 'home'
      ? { title: data.content.profile.name, description: data.content.page.heroExperience }
      : defaultMetadata(),
  about: pageMetadata,
  cases: pageMetadata,
  collections: pageMetadata,
  contact: pageMetadata,
  findings: pageMetadata,
  follow: pageMetadata,
  license: pageMetadata,
  now: pageMetadata,
  projects: pageMetadata,
  writing: pageMetadata,
  credits: (data) =>
    data.kind === 'credits'
      ? { title: data.content.page.title, description: data.content.page.description }
      : defaultMetadata(),
  resume: (data) =>
    data.kind === 'resume'
      ? { title: data.content.page.title, description: data.content.page.description }
      : defaultMetadata(),
  'case-detail': articleMetadata,
  'finding-detail': articleMetadata,
  'writing-detail': articleMetadata,
  'collection-detail': (data) =>
    data.kind === 'collection-detail'
      ? { title: data.collection.title, description: data.collection.description }
      : defaultMetadata(),
  'project-detail': (data) =>
    data.kind === 'project-detail'
      ? { title: data.project.name, description: data.project.purpose, type: 'article' }
      : defaultMetadata(),
  'experiment-detail': (data) =>
    data.kind === 'experiment-detail'
      ? { title: data.experiment.name, description: data.experiment.purpose, type: 'article' }
      : defaultMetadata(),
  'snippet-detail': (data) =>
    data.kind === 'snippet-detail'
      ? { title: data.snippet.title, description: data.snippet.description, type: 'article' }
      : defaultMetadata(),
  'technology-detail': (data) =>
    data.kind === 'technology-detail'
      ? { title: data.technology.name, description: data.technology.skills.join(' · ') }
      : defaultMetadata(),
  'topic-detail': (data) =>
    data.kind === 'topic-detail'
      ? { title: data.topic.name, description: data.topic.name }
      : defaultMetadata(),
  tool: (data) =>
    data.kind === 'tool' ? { title: data.slug, description: data.slug } : defaultMetadata(),
  'tools-index': kindMetadata,
  snippets: kindMetadata,
  technologies: kindMetadata,
  'finding-type': kindMetadata,
  portfolio: (data) =>
    data.kind === 'portfolio'
      ? { title: data.profile.name, description: data.page.heroExperience }
      : defaultMetadata(),
  topics: () => ({ title: 'Topics', description: 'Topics' }),
  status: (data) =>
    data.kind === 'status'
      ? { title: data.status === 'error' ? 'Error' : 'Not found', description: data.status }
      : defaultMetadata(),
};

export function metadataForRoute(data: RouteData | undefined): RouteMetadata {
  return data ? (metadataResolvers[data.kind]?.(data) ?? defaultMetadata()) : defaultMetadata();
}
