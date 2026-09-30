import type { ReactNode } from 'react';

type FindingCardPresentationProps = {
  metadata?: ReactNode;
  summary: ReactNode;
  topics?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
};

export function FindingCardPresentation(props: FindingCardPresentationProps) {
  return (
    <>
      {props.metadata}
      {props.summary}
      {props.topics}
      {props.actions}
      {props.footer}
    </>
  );
}
