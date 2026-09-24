'use client';

import { Box } from '../../ui';
import { StatusContent } from './status-content';
import type { StatusPageKind } from './status-page-kind';

type StatusPageProps = {
  kind: StatusPageKind;
  sourceRepositoryUrl?: string;
  reset?: () => void;
};

export function StatusPage(props: StatusPageProps) {
  return (
    <Box visualVariant="statusPage">
      <StatusContent {...props} />
    </Box>
  );
}
