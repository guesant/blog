'use client';

import { Box } from '../../ui';
import { StatusContent } from './status-content';

type StatusPageProps = {
  kind: 'notFound' | 'error';
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
