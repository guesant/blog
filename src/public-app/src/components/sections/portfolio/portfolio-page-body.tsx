import { Link } from '../../ui';
import { CollectionPagination } from '../../content/collection-pagination';
import { NavLink } from '../../primitives/nav-link';
import { useTranslations } from '@/i18n/compat';
import type { PortfolioPageContentProps } from './types';
import { PortfolioAction } from './ui/action';
import { PortfolioCaseSection } from './portfolio-case-section';
import { PortfolioProjectsSection } from './portfolio-projects-section';
import { portfolioPaginationMeta } from './portfolio-pagination-meta';

type PortfolioPageBodyProps = PortfolioPageContentProps & {
  tHome: ReturnType<typeof useTranslations>;
};

export function PortfolioPageBody(props: PortfolioPageBodyProps) {
  return (
    <>
      <PortfolioCaseSection page={props.page} cases={props.cases} />
      <PortfolioProjectsSection
        page={props.page}
        projects={props.projects}
        experiments={props.experiments}
        experimentsPagination={props.experimentsPagination}
      />
      <CollectionPagination
        meta={portfolioPaginationMeta({
          cases: props.casesPagination,
          projects: props.projectsPagination,
          experiments: props.experimentsPagination,
        })}
        action="/portfolio"
        pageParameter="portfolio_page"
      />
      <PortfolioAction>
        <Link component={NavLink} href="/resume">
          {props.tHome('experienceAction')}
        </Link>
      </PortfolioAction>
    </>
  );
}
