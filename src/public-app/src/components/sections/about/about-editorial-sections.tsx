import { Box, Divider } from '../../ui';
import { AboutEditorialSection } from './about-editorial-section';
import type { AboutEditorialSectionsProps } from './types';

export function AboutEditorialSections(props: AboutEditorialSectionsProps) {
  if (props.sections.length === 0) {
    return null;
  }

  return (
    <Box visualVariant="aboutEditorialSections">
      {props.sections.map((section) => (
        <AboutEditorialSection key={section.id} section={section} />
      ))}
      <Divider visualVariant="aboutSectionDivider" />
    </Box>
  );
}
