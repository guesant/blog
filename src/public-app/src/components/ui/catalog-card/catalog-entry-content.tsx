import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';
import { FindingCardDescription, FindingCardTitle } from '../finding-card';

type CatalogEntryContentProps = {
  meta?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  titleComponent?: 'h2' | 'h3';
};

export function CatalogEntryContent(props: CatalogEntryContentProps) {
  return (
    <>
      {props.meta}
      <FindingCardTitle component={props.titleComponent ?? 'h2'} presentation="feed">
        {props.title}
      </FindingCardTitle>
      <ConditionalContent
        condition={Boolean(props.description)}
        content={
          <FindingCardDescription presentation="feed">{props.description}</FindingCardDescription>
        }
      />
    </>
  );
}
