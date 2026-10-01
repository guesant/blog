import type { ReactNode } from 'react';
import { PageSectionTrailingSpacingFrame } from '../../ui/semantic/PageSectionTrailingSpacingFrame';

type PortfolioWorkSectionProps = {
  children: ReactNode;
};

export function PortfolioWorkSection(props: PortfolioWorkSectionProps) {
  return (
    <PageSectionTrailingSpacingFrame component="section">
      {props.children}
    </PageSectionTrailingSpacingFrame>
  );
}
