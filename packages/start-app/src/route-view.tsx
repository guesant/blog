import { PageLayout } from '../components/layouts/page-layout';
import { ContentFeed } from '../components/content/content-feed';
import { AboutPageContent } from '../components/pages/about-page-content';
import { AchadoDetailContent } from '../components/pages/achado-detail-content';
import { CaseDetailContent } from '../components/pages/case-detail-content';
import { CasesPageContent } from '../components/pages/cases-page-content';
import { ColecaoDetailContent } from '../components/pages/colecao-detail-content';
import { ContactPageContent } from '../components/pages/contact-page-content';
import { CreditsPageContent } from '../components/pages/credits-page-content';
import { ExperimentDetailContent } from '../components/pages/experiment-detail-content';
import { KnowledgeMapContent } from '../components/pages/knowledge-map-content';
import { LicensePageContent } from '../components/pages/license-page-content';
import { ProjectDetailContent } from '../components/pages/project-detail-content';
import { ProjectsPageContent } from '../components/pages/projects-page-content';
import { ResumePageContent } from '../components/pages/resume-page-content';
import { TipoDetailContent } from '../components/pages/tipo-detail-content';
import { TopicoDetailContent } from '../components/pages/topico-detail-content';
import { TopicosPageContent } from '../components/pages/topicos-page-content';
import { WritingDetailContent } from '../components/pages/writing-detail-content';
import { HomeComposite } from '../components/sections/home-composite';
import { PasswordGenerator } from '../components/tools/password-generator';
import { RandomStringGenerator } from '../components/tools/random-string-generator';
import type { RouteData } from './data/content';
import { usePathname } from '../i18n/compat';

export function RouteView(props: { data: RouteData }) {
  const { data } = props;
  const pathname = usePathname();
  switch (data.kind) {
    case 'home':
      return <HomeComposite content={data.content} writings={data.writings} findings={data.findings} collections={data.collections} />;
    case 'about':
      return <PageLayout><AboutPageContent page={data.page} profile={data.profile} /></PageLayout>;
    case 'cases':
      return <PageLayout><CasesPageContent page={data.page} items={data.items} /></PageLayout>;
    case 'case-detail':
      return <CaseDetailContent item={data.item} />;
    case 'collections':
      return <ContentFeed writings={data.writings} findings={data.findings} collections={data.collections} copy={data.page} fixedKind="colecao" action="/collections" />;
    case 'collection-detail':
      return <PageLayout><ColecaoDetailContent collection={data.collection} /></PageLayout>;
    case 'contact':
      return <PageLayout><ContactPageContent page={data.page} site={data.site} /></PageLayout>;
    case 'credits':
      return <PageLayout><CreditsPageContent content={data.content} /></PageLayout>;
    case 'findings':
      return <ContentFeed writings={data.writings} findings={data.findings} collections={data.collections} copy={data.page} fixedKind="achado" action="/findings" />;
    case 'finding-detail':
      return <AchadoDetailContent item={data.item} />;
    case 'finding-type':
      return <PageLayout><TipoDetailContent tipo={data.type} references={data.references.filter((item) => item.type === data.type)} /></PageLayout>;
    case 'knowledge-map':
      return <PageLayout><KnowledgeMapContent nodes={data.graph.nodes} edges={data.graph.edges} /></PageLayout>;
    case 'license':
      return <PageLayout><LicensePageContent emailChallenge={data.site.contact.emailChallenge} /></PageLayout>;
    case 'projects':
      return <PageLayout><ProjectsPageContent page={data.page} projects={data.projects} experiments={data.experiments} /></PageLayout>;
    case 'project-detail':
      return <ProjectDetailContent project={data.project} />;
    case 'experiment-detail':
      return <ExperimentDetailContent experiment={data.experiment} />;
    case 'resume':
      return <ResumePageContent content={data.content} pdfUrls={data.pdfUrls} />;
    case 'tools':
      return pathname.endsWith('password-generator') ? <PageLayout><PasswordGenerator /></PageLayout> : <PageLayout><RandomStringGenerator /></PageLayout>;
    case 'topics':
      return <PageLayout><TopicosPageContent topics={data.topics} /></PageLayout>;
    case 'topic-detail':
      return <PageLayout><TopicoDetailContent topic={data.topic} references={data.references} /></PageLayout>;
    case 'writing':
      return <ContentFeed writings={data.writings} findings={data.findings} collections={data.collections} copy={data.page} fixedKind="post" action="/writing" />;
    case 'writing-detail':
      return <WritingDetailContent item={data.item} />;
  }
}
