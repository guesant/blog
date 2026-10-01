import { AboutEditorialSection } from './about-editorial-section';
import type { AboutEditorialSectionsProps } from './types';
import { AboutEditorialSectionsFrame } from '../../ui/semantic/AboutEditorialSectionsFrame';
import { AboutSectionDivider } from '../../ui/semantic/AboutSectionDivider';

export function AboutEditorialSections(props: AboutEditorialSectionsProps) {
  if (props.sections.length === 0) {
    return null;
  }

  return (
    <AboutEditorialSectionsFrame>
      {props.sections.map((section) => (
        <AboutEditorialSection key={section.id} section={section} />
      ))}
      <AboutSectionDivider />
    </AboutEditorialSectionsFrame>
  );
}
