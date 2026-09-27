import type { ReactNode } from 'react';

type FindingCardPresentationProps = {
  metadata?: ReactNode;
  summary: ReactNode;
  previews?: ReactNode;
  topics?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
};

export function FindingCardPresentation(props: FindingCardPresentationProps) {
  return (
    <>
      {props.metadata}
      {props.summary}
      {props.previews}
      {props.topics}
      {props.actions}
      {props.footer}
    </>
  );
}
