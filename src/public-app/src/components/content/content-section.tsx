import type { ContentSectionProps } from './content-section.types';
import { EditorialSectionLayout } from './editorial-section-layout';

export function ContentSection(props: ContentSectionProps) {
  return <EditorialSectionLayout {...props} />;
}
