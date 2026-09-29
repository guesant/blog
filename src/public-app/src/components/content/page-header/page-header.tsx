import { Divider } from '../../ui';
import { PageHeaderFrame } from '../../ui';
import { PageHeaderSectionFrame } from '../../ui';
import { Breadcrumbs } from '../../navigation/breadcrumbs';
import type { PageHeaderProps } from './types';

export function PageHeader(props: PageHeaderProps) {
  return (
    <PageHeaderSectionFrame>
      <PageHeaderFrame
        variant={props.variant ?? 'reading'}
        breadcrumbs={props.breadcrumbs ? <Breadcrumbs trail={props.breadcrumbs} /> : undefined}
        title={props.title}
        description={props.description}
        meta={props.meta}
        metadata={props.metadata}
        actions={props.actions}
      />
      <Divider />
    </PageHeaderSectionFrame>
  );
}
