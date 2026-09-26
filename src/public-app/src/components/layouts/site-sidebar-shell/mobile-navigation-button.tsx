import { Button } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { SidebarTranslator } from '@/i18n/compat-support';

type MobileNavigationButtonProps = {
  onOpen: () => void;
  t: SidebarTranslator;
};

export function MobileNavigationButton(props: MobileNavigationButtonProps) {
  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<Icon name="menu" size={14} />}
      onClick={props.onOpen}
    >
      {props.t('navigation')}
    </Button>
  );
}
