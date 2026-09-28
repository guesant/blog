'use client';

import { StatusContent } from './status-content';
import type { StatusPageKind } from './status-page-kind';
import { StatusPageFrame } from '../../ui/semantic/StatusPageFrame';

type StatusPageProps = {
  kind: StatusPageKind;
  sourceRepositoryUrl?: string;
  reset?: () => void;
};

export function StatusPage(props: StatusPageProps) {
  return (
    <StatusPageFrame>
      <StatusContent {...props} />
    </StatusPageFrame>
  );
}
