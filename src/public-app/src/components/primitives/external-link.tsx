import { Link } from '../ui';
import type { ComponentProps } from 'react';
import { Icon, type IconName } from './icon';
import { ExternalLinkLeadingIcon } from './external-link-leading-icon';

type ExternalLinkProps = ComponentProps<typeof Link> & {
  iconSize?: number;
  leadingIcon?: IconName;
  visualVariant?: string;
};

export function ExternalLink(props: ExternalLinkProps) {
  const { children, leadingIcon, iconSize, rel, target, visualVariant, ...linkProps } = props;

  const size = iconSize ?? 15;

  return (
    <Link
      {...linkProps}
      target={target ?? '_blank'}
      rel={rel ?? 'noopener noreferrer'}
      visualVariant={visualVariant ?? 'externalLink'}
    >
      <ExternalLinkLeadingIcon name={leadingIcon} size={size} />
      {children}
      <Icon name="external" size={size} />
    </Link>
  );
}
