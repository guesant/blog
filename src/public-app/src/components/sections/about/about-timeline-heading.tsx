import { ContentRichText } from '../../content/content-rich-text';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { AboutTimelineHeadingProps } from './types';
import { AboutEditorialDescriptionFrame } from '../../ui/semantic/AboutEditorialDescriptionFrame';
import { AboutEditorialSectionTitleText } from '../../ui/semantic/AboutEditorialSectionTitleText';

export function AboutTimelineHeading(props: AboutTimelineHeadingProps) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(props.title)}
        content={
          <AboutEditorialSectionTitleText variant="h2">
            {props.title}
          </AboutEditorialSectionTitleText>
        }
      />
      <ConditionalContent
        condition={Boolean(props.description)}
        content={
          <AboutEditorialDescriptionFrame>
            <ContentRichText content={props.description ?? {}} />
          </AboutEditorialDescriptionFrame>
        }
      />
    </>
  );
}
