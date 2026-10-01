import { ContentRichText } from '../../content/content-rich-text';
import type { AboutIntroductionProps } from './types';
import { AboutEditorialIntroductionFrame } from '../../ui/semantic/AboutEditorialIntroductionFrame';
import { AboutSectionDivider } from '../../ui/semantic/AboutSectionDivider';

export function AboutIntroduction(props: AboutIntroductionProps) {
  return (
    <AboutEditorialIntroductionFrame>
      <ContentRichText content={props.content} />
      <AboutSectionDivider />
    </AboutEditorialIntroductionFrame>
  );
}
