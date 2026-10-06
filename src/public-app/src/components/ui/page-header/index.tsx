import type { ReactNode } from 'react';
import type { PageHeaderVariant } from './styles';
import { PageHeaderReadingFrame } from './page-header-reading-frame';
import { PageHeaderShowcaseFrame } from './page-header-showcase-frame';

export type { PageHeaderVariant } from './styles';

export type PageHeaderFrameProps = {
  variant: PageHeaderVariant;
  breadcrumbs?: ReactNode;
  titleAdornment?: ReactNode;
  titleAdornmentInline?: boolean;
  title: string;
  description?: ReactNode;
  meta?: string;
  metadata?: ReactNode;
  actions?: ReactNode;
};

export function PageHeaderFrame(props: PageHeaderFrameProps) {
  const contentProps = { ...props };

  if (props.variant === 'showcase') {
    return <PageHeaderShowcaseFrame {...contentProps} />;
  }

  return <PageHeaderReadingFrame {...contentProps} />;
}
