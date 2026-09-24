'use client';

import type { FeedPageCopy } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { BreadcrumbItem } from '../../navigation/breadcrumbs';
import { PageHeader } from '../page-header';

type ContentFeedHeaderProps = {
  copy: FeedPageCopy;
  breadcrumbs?: BreadcrumbItem[];
  visible: boolean;
};

export function ContentFeedHeader(props: ContentFeedHeaderProps) {
  return (
    <ConditionalContent
      condition={props.visible}
      content={
        <PageHeader
          title={props.copy.title}
          description={props.copy.description}
          breadcrumbs={props.breadcrumbs}
          visualVariant="contentFeedHeader"
          descriptionVisualVariant="contentFeedDescription"
        />
      }
    />
  );
}
