import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type CreditsReferenceGridProps = {
  children: ReactNode;
};

export function CreditsReferenceGrid(props: CreditsReferenceGridProps) {
  return <Box visualVariant="referenceGrid">{props.children}</Box>;
}
