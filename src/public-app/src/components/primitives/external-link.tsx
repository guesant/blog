import type { ComponentProps } from 'react';
import { Link } from '../ui';
import type { IconName } from './icon';
import { ExternalLinkPresentation } from '../ui/semantic/ExternalLinkPresentation';

type ExternalLinkProps = ComponentProps<typeof Link> & {
  iconSize?: number;
  leadingIcon?: IconName;
};

export function ExternalLink(props: ExternalLinkProps) {
  return <ExternalLinkPresentation {...props} />;
}
