'use client';

import { Icon, type IconName } from '../../../primitives/icon';
import { Link as LocaleLink } from '../../../../i18n/navigation';
import { ActionButton } from '../../../ui/semantic/ActionButton';

type HomeHeroNavigationButtonProps = { href: string; icon: IconName; label: string };

export function HomeHeroNavigationButton(props: HomeHeroNavigationButtonProps) {
  return (
    <ActionButton
      component={LocaleLink}
      href={props.href}
      variant="outlined"

      startIcon={<Icon name={props.icon} size={15} />}
      sx={{ flexShrink: 0, width: '100%', justifyContent: 'flex-start' }}
    >
      {props.label}
    </ActionButton>
  );
}
