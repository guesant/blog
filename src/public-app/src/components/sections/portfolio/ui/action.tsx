import type { ReactNode } from 'react';
import { PageSectionLeadingSpacingFrame } from '../../../ui/semantic/PageSectionLeadingSpacingFrame';

type PortfolioActionProps = {
  children: ReactNode;
};

export function PortfolioAction(props: PortfolioActionProps) {
  return <PageSectionLeadingSpacingFrame>{props.children}</PageSectionLeadingSpacingFrame>;
}
