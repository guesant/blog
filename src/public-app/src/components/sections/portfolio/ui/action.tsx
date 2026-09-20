import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type PortfolioActionProps = {
  children: ReactNode;
};

export function PortfolioAction(props: PortfolioActionProps) {
  return <Box visualVariant="pageSectionStart">{props.children}</Box>;
}
