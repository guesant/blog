import type { ComponentProps } from 'react';
import { Link } from '../link';
import { mergeSx } from '@/components/ui/sx';
import { Icon, type IconName } from '../../primitives/icon';
import { ExternalLinkLeadingIcon } from '../../primitives/external-link-leading-icon';

type ExternalLinkPresentationProps = ComponentProps<typeof Link> & {
  iconSize?: number;
  leadingIcon?: IconName;
};

const externalLinkStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--site-space-1)',
};

export function ExternalLinkPresentation(props: ExternalLinkPresentationProps) {
  const { children, leadingIcon, iconSize, rel, target, sx, ...linkProps } = props;

  const size = iconSize ?? 15;

  return (
    <Link
      {...linkProps}
      target={target ?? '_blank'}
      rel={rel ?? 'noopener noreferrer'}
      data-site-external-link="true"
      sx={mergeSx(externalLinkStyles, sx)}
    >
      <ExternalLinkLeadingIcon name={leadingIcon} size={size} />
      {children}
      <Icon name="external" size={size} />
    </Link>
  );
}
