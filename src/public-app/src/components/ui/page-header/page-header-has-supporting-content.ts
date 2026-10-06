import type { ReactNode } from 'react';

type PageHeaderSupportingContentInput = {
  actions?: ReactNode;
  meta?: string;
  metadata?: ReactNode;
};

export function pageHeaderHasSupportingContent(props: PageHeaderSupportingContentInput) {
  return Boolean(props.actions || props.meta || props.metadata);
}
