import { AboutEditorialSection } from './about-editorial-section';
import type { AboutEditorialSectionsProps } from './types';
import { AboutEditorialSectionsFrame } from '../../ui/semantic/AboutEditorialSectionsFrame';
import { AboutSectionDividerDivider } from '../../ui/semantic/AboutSectionDividerDivider';

export function AboutEditorialSections(props: AboutEditorialSectionsProps) {
  if (props.sections.length === 0) {
    return null;
  }

  return (
    <AboutEditorialSectionsFrame>
      {props.sections.map((section) => (
        <AboutEditorialSection key={section.id} section={section} />
      ))}
      <AboutSectionDividerDivider />
    </AboutEditorialSectionsFrame>
  );
}
