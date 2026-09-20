import { Button } from '../../ui';
import { Icon } from '../../primitives/icon';
import { useTranslations } from '@/i18n/compat';

type MobileNavigationButtonProps = {
  onOpen: () => void;
  t: ReturnType<typeof useTranslations>;
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
