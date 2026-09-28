import { ContentRichText } from '../../content/content-rich-text';
import type { AboutIntroductionProps } from './types';
import { AboutEditorialIntroductionFrame } from '../../ui/semantic/AboutEditorialIntroductionFrame';
import { AboutSectionDividerDivider } from '../../ui/semantic/AboutSectionDividerDivider';

export function AboutIntroduction(props: AboutIntroductionProps) {
  return (
    <AboutEditorialIntroductionFrame>
      <ContentRichText content={props.content} />
      <AboutSectionDividerDivider />
    </AboutEditorialIntroductionFrame>
  );
}
