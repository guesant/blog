import type { RouteRenderer } from './route-renderers.types';
import { AchadoDetailContent } from '../../sections/finding-detail';
import { CaseDetailContent } from '../../sections/case-detail';
import { ColecaoDetailContent } from '../../sections/collection-detail';
import { ExperimentDetailContent } from '../../sections/experiment-detail';
import { ProjectDetailContent } from '../../sections/project-detail';
import { SnippetDetailPageContent } from '../../sections/snippets';
import { TechnologyDetailPageContent } from '../../sections/technologies';
import { TipoDetailContent } from '../../sections/finding-type';
import { TopicoDetailContent } from '../../sections/topic-detail';
import { WritingDetailContent } from '../../sections/writing-detail';

export const detailRouteRenderers: Record<string, RouteRenderer> = {
  'case-detail': (data) =>
    data.kind === 'case-detail' ? <CaseDetailContent item={data.item} /> : null,
  'collection-detail': (data) =>
    data.kind === 'collection-detail' ? (
      <ColecaoDetailContent collection={data.collection} />
    ) : null,
  'finding-detail': (data) =>
    data.kind === 'finding-detail' ? <AchadoDetailContent item={data.item} /> : null,
  'finding-type': (data) =>
    data.kind === 'finding-type' ? (
      <TipoDetailContent
        tipo={data.type}
        references={data.references.filter((item) => item.type === data.type)}
      />
    ) : null,
  'experiment-detail': (data) =>
    data.kind === 'experiment-detail' ? (
      <ExperimentDetailContent experiment={data.experiment} />
    ) : null,
  'project-detail': (data) =>
    data.kind === 'project-detail' ? <ProjectDetailContent project={data.project} /> : null,
  'snippet-detail': (data) =>
    data.kind === 'snippet-detail' ? <SnippetDetailPageContent snippet={data.snippet} /> : null,
  'technology-detail': (data) =>
    data.kind === 'technology-detail' ? (
      <TechnologyDetailPageContent technology={data.technology} />
    ) : null,
  'topic-detail': (data) =>
    data.kind === 'topic-detail' ? (
      <TopicoDetailContent topic={data.topic} references={data.references} />
    ) : null,
  'writing-detail': (data) =>
    data.kind === 'writing-detail' ? <WritingDetailContent item={data.item} /> : null,
};
