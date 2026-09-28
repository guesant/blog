import { PageHeaderFrame } from '../../ui';
import { Breadcrumbs } from '../../navigation/breadcrumbs';
import type { PageHeaderProps } from './types';

export function PageHeader(props: PageHeaderProps) {
  return (
    <PageHeaderFrame
      layout={props.layout ?? 'standard'}
      breadcrumbs={props.breadcrumbs ? <Breadcrumbs trail={props.breadcrumbs} /> : undefined}
      title={props.title}
      description={props.description}
      meta={props.meta}
      metadata={props.metadata}
      actions={props.actions}
    />
  );
}
