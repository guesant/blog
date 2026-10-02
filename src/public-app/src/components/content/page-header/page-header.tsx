import { PageHeaderFrame } from '../../ui';
import { PageHeaderContentFrame } from '../../ui/semantic/PageHeaderContentFrame';
import { Breadcrumbs } from '../../navigation/breadcrumbs';
import type { PageHeaderProps } from './types';

export function PageHeader(props: PageHeaderProps) {
  return (
    <PageHeaderContentFrame>
      <PageHeaderFrame
        variant={props.variant ?? 'reading'}
        breadcrumbs={props.breadcrumbs ? <Breadcrumbs trail={props.breadcrumbs} /> : undefined}
        titleAdornment={props.titleAdornment}
        title={props.title}
        description={props.description}
        meta={props.meta}
        metadata={props.metadata}
        actions={props.actions}
      />
    </PageHeaderContentFrame>
  );
}
