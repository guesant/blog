'use client';

import { Button } from '../../../ui';
import { Link as LocaleLink } from '../../../../i18n/navigation';
import { Icon } from '../../../primitives/icon';
import type { TextLinkProps } from '../types';

export function TextLink(props: TextLinkProps) {
  const { href, children } = props;

  return (
    <Button
      component={LocaleLink}
      href={href}
      variant="outlined"
      siteVariant="action"
      endIcon={<Icon name="arrow" size={15} />}
      sx={{ justifySelf: 'start' }}
    >
      {children}
    </Button>
  );
}
