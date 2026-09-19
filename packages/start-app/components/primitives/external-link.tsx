import Link from '@mui/material/Link';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ComponentProps } from 'react';
import { Icon, type IconName } from './icon';
import { normalizeSx } from './sx';

type ExternalLinkProps = ComponentProps<typeof Link> & {
  iconSize?: number;
  leadingIcon?: IconName;
};

export function ExternalLink(externalLinkProps: ExternalLinkProps) {
  const {
    children,
    iconSize = 15,
    leadingIcon,
    rel = 'noopener noreferrer',
    target = '_blank',
    sx,
    ...linkProps
  } = externalLinkProps;
  const styles: SxProps<Theme> = [
    { display: 'inline-flex', alignItems: 'center', gap: 0.75 },
    ...normalizeSx(sx),
  ];

  return (
    <Link {...linkProps} target={target} rel={rel} sx={styles}>
      {leadingIcon && <Icon name={leadingIcon} size={iconSize} style={{ opacity: 0.6 }} />}
      {children}
      <Icon name="external" size={iconSize} />
    </Link>
  );
}
