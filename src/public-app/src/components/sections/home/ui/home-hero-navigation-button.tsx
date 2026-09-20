'use client';

import { Button } from '../../../ui';
import { Icon, type IconName } from '../../../primitives/icon';
import { Link as LocaleLink } from '../../../../i18n/navigation';

type HomeHeroNavigationButtonProps = { href: string; icon: IconName; label: string };

export function HomeHeroNavigationButton(props: HomeHeroNavigationButtonProps) {
  return (
    <Button
      component={LocaleLink}
      href={props.href}
      variant="outlined"
      siteVariant="action"
      startIcon={<Icon name={props.icon} size={15} />}
      sx={{ flexShrink: 0, width: '100%', justifyContent: 'flex-start' }}
    >
      {props.label}
    </Button>
  );
}
