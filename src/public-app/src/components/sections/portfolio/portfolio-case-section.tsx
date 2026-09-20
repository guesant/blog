import { Typography } from '../../ui';
import { CaseShowcase } from '../../content/case-showcase';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { PortfolioPageContentProps } from './types';
import { PortfolioSectionDescription } from './ui/section-description';
import { PortfolioSectionTitle } from './ui/section-title';
import { PortfolioWorkSection } from './portfolio-work-section';

type PortfolioCaseSectionProps = Pick<PortfolioPageContentProps, 'page' | 'cases'>;

export function PortfolioCaseSection(props: PortfolioCaseSectionProps) {
  return (
    <ConditionalContent
      condition={props.cases.length > 0}
      content={
        <PortfolioWorkSection>
          <Typography variant="overline" color="text.secondary">
            {props.page.workEyebrow}
          </Typography>
          <PortfolioSectionTitle>{props.page.workTitle}</PortfolioSectionTitle>
          <PortfolioSectionDescription>{props.page.workDescription}</PortfolioSectionDescription>
          <CaseShowcase cases={props.cases.slice(0, 3)} />
        </PortfolioWorkSection>
      }
    />
  );
}
