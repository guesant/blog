import type { EditablePageHeaderProps } from './types';
import { PageHeader } from './page-header';

export function EditablePageHeader(props: EditablePageHeaderProps) {
  const { page, breadcrumbs } = props;

  return <PageHeader title={page.title} description={page.description} breadcrumbs={breadcrumbs} />;
}
