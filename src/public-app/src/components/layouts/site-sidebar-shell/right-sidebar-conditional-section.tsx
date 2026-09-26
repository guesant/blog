import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';
import { SidebarSection } from './sidebar-section';

type RightSidebarConditionalSectionProps = {
  children: ReactNode;
  label: string;
  visible: boolean;
};

export function RightSidebarConditionalSection(props: RightSidebarConditionalSectionProps) {
  return (
    <ConditionalContent
      condition={props.visible}
      content={<SidebarSection label={props.label}>{props.children}</SidebarSection>}
    />
  );
}
