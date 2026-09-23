import { Typography } from '../../ui';
import { CaseShowcase } from '../../content/case-showcase';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { PortfolioPageContentProps } from './types';
import { PortfolioSectionDescription } from './ui/section-description';
import { PortfolioSectionTitle } from './ui/section-title';
import { PortfolioWorkSection } from './portfolio-work-section';
import { useProgressiveCollection } from '../../../data/queries/use-progressive-collection';
import { collectionQuery } from '../../../data/queries/content-data-collection-query';
import type { CaseStudy } from '@portfolio/data/domain/types';
import { ProgressiveCollectionFooter } from '../../content/progressive-collection/progressive-collection-footer';

type PortfolioCaseSectionProps = Pick<
  PortfolioPageContentProps,
  'page' | 'cases' | 'casesPagination' | 'search'
>;

export function PortfolioCaseSection(props: PortfolioCaseSectionProps) {
  const progressive = useProgressiveCollection<CaseStudy>({
    collection: 'cases',
    query: collectionQuery(props.search, 'portfolio_page', 3),
    initialPage: { items: props.cases, meta: props.casesPagination },
    queryKey: ['portfolio', 'cases', props.search],
    getKey: (item) => item.slug,
  });

  return (
    <ConditionalContent
      condition={progressive.items.length > 0}
      content={
        <PortfolioWorkSection>
          <Typography variant="overline" color="text.secondary">
            {props.page.workEyebrow}
          </Typography>
          <PortfolioSectionTitle>{props.page.workTitle}</PortfolioSectionTitle>
          <PortfolioSectionDescription>{props.page.workDescription}</PortfolioSectionDescription>
          <CaseShowcase cases={progressive.items} />
          <ProgressiveCollectionFooter progressive={progressive} />
        </PortfolioWorkSection>
      }
    />
  );
}
