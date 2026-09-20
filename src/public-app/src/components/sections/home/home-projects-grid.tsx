import { ProjectCard } from '../../content/project-card';
import { ConditionalContent } from '../../primitives/conditional-content';
import { HomeProjectGrid } from './ui/home-project-grid';
import type { Project } from '@portfolio/data/domain/types';

type HomeProjectsGridProps = {
  projects: Project[];
};

export function HomeProjectsGrid(props: HomeProjectsGridProps) {
  return (
    <ConditionalContent
      condition={props.projects.length > 0}
      content={
        <HomeProjectGrid>
          {props.projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} highlighted={index === 0} />
          ))}
        </HomeProjectGrid>
      }
    />
  );
}
