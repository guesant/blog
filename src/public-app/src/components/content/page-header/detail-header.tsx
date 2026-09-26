import type { DetailHeaderProps } from './types';
import { PageHeader } from './page-header';

export function DetailHeader(props: DetailHeaderProps) {
  return (
    <PageHeader
      {...props}
      visualVariant="detailHeader"
      titleVisualVariant="detailHeader2"
      descriptionVisualVariant="detailHeader3"
      metaVisualVariant="detailHeader4"
    />
  );
}
