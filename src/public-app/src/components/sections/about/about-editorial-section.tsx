import { ContentRichText } from '../../content/content-rich-text';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { AboutEditorialSectionProps } from './types';
import { AboutEditorialSectionFrame } from '../../ui/semantic/AboutEditorialSectionFrame';
import { AboutEditorialSectionTitleText } from '../../ui/semantic/AboutEditorialSectionTitleText';

export function AboutEditorialSection(props: AboutEditorialSectionProps) {
  return (
    <AboutEditorialSectionFrame>
      <ConditionalContent
        condition={Boolean(props.section.title)}
        content={
          <AboutEditorialSectionTitleText variant="h2">
            {props.section.title}
          </AboutEditorialSectionTitleText>
        }
      />
      <ContentRichText content={props.section.body} />
    </AboutEditorialSectionFrame>
  );
}
