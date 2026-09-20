import { ConditionalContent } from '../../primitives/conditional-content';
import { Icon } from '../../primitives/icon';
import { SidebarAction } from './sidebar-action';
import { SidebarSection } from './sidebar-section';

type RightSidebarSourceSectionProps = {
  visible: boolean;
  buildUrl?: string;
  buildSha?: string;
  label: string;
};

export function RightSidebarSourceSection(props: RightSidebarSourceSectionProps) {
  return (
    <ConditionalContent
      condition={props.visible}
      content={
        <SidebarSection label={props.label}>
          <SidebarAction
            component="a"
            href={props.buildUrl ?? '/'}
            target="_blank"
            rel="noopener noreferrer"
            icon={<Icon name="evolution" size={14} />}
            label={`build ${props.buildSha ?? ''}`}
            endIcon={<Icon name="external" size={12} />}
          />
        </SidebarSection>
      }
    />
  );
}
