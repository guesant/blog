'use client';

import { CaseFactFrame, CaseFactLabel, CaseFactValue } from '../../ui';

type CaseFactProps = {
  label: string;
  value: string;
  field: string;
};

export function CaseFact(props: CaseFactProps) {
  const { label, value } = props;

  return (
    <CaseFactFrame>
      <CaseFactLabel>{label}</CaseFactLabel>
      <CaseFactValue>{value}</CaseFactValue>
    </CaseFactFrame>
  );
}
