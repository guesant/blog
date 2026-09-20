import type { ReactNode } from 'react';
import { Box } from '../../ui';

type PortfolioWorkSectionProps = {
  children: ReactNode;
};

export function PortfolioWorkSection(props: PortfolioWorkSectionProps) {
  return (
    <Box component="section" visualVariant="pageSectionEnd">
      {props.children}
    </Box>
  );
}
