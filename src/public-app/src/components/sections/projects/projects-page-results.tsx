import { Typography } from '../../ui';
import { EmptyState } from '../../content/empty-state';
import { ListingView } from '../../content/listing-view';
import type { useTranslations } from '@/i18n/compat';
import type { ProjectsPageContentProps } from './types';
import { ProjectRow } from './project-row';
import { ConditionalContent } from '../../primitives/conditional-content';

type ProjectsPageResultsProps = {
  page: ProjectsPageContentProps['page'];
  projects: ProjectsPageContentProps['projects'];
  tCommon: ReturnType<typeof useTranslations>;
};

export function ProjectsPageResults(props: ProjectsPageResultsProps) {
  return (
    <>
      <ConditionalContent
        condition={props.projects.length > 0}
        content={
          <Typography
            variant="overline"
            color="text.secondary"
            visualVariant="selectedProjectsLabel"
          >
            {props.page.selectedLabel}
          </Typography>
        }
      />
      <ConditionalContent
        condition={props.projects.length === 0}
        content={<EmptyState icon="problem">{props.tCommon('emptyProjects')}</EmptyState>}
      />
      <ConditionalContent
        condition={props.projects.length > 0}
        content={
          <ListingView
            items={props.projects}
            getKey={(item) => item.slug}
            renderListItem={(item) => <ProjectRow item={item} />}
          />
        }
      />
    </>
  );
}
