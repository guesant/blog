import type { ReactNode } from 'react';
import { PageSectionEndFrame } from '../../ui/semantic/PageSectionEndFrame';

type PortfolioWorkSectionProps = {
  children: ReactNode;
};

export function PortfolioWorkSection(props: PortfolioWorkSectionProps) {
  return <PageSectionEndFrame component="section">{props.children}</PageSectionEndFrame>;
}
