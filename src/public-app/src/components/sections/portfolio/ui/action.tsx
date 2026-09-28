import type { ReactNode } from 'react';
import { PageSectionStartFrame } from '../../../ui/semantic/PageSectionStartFrame';

type PortfolioActionProps = {
  children: ReactNode;
};

export function PortfolioAction(props: PortfolioActionProps) {
  return <PageSectionStartFrame>{props.children}</PageSectionStartFrame>;
}
