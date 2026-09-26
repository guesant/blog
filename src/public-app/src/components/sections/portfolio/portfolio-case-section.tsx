import { CaseShowcase } from '../../content/case-showcase';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { PortfolioPageContentProps } from './types';
import { PortfolioSectionDescription } from './ui/section-description';
import { PortfolioSectionTitle } from './ui/section-title';
import { PortfolioWorkSection } from './portfolio-work-section';
import type { CaseStudy } from '@portfolio/data/domain/types';
import { ProgressiveCollectionFooter } from '../../content/progressive-collection/progressive-collection-footer';
import { usePortfolioProgressiveCollection } from './use-portfolio-progressive-collection';

type PortfolioCaseSectionProps = Pick<
  PortfolioPageContentProps,
  'page' | 'cases' | 'casesPagination' | 'search'
>;

export function PortfolioCaseSection(props: PortfolioCaseSectionProps) {
  const progressive = usePortfolioProgressiveCollection<CaseStudy>({
    collection: 'cases',
    items: props.cases,
    pagination: props.casesPagination,
    queryKey: 'cases',
    search: props.search,
    getKey: (item) => item.slug,
  });

  return (
    <ConditionalContent
      condition={progressive.items.length > 0}
      content={
        <PortfolioWorkSection>
          <PortfolioSectionTitle>{props.page.workTitle}</PortfolioSectionTitle>
          <PortfolioSectionDescription>{props.page.workDescription}</PortfolioSectionDescription>
          <CaseShowcase cases={progressive.items} />
          <ProgressiveCollectionFooter progressive={progressive} />
        </PortfolioWorkSection>
      }
    />
  );
}
