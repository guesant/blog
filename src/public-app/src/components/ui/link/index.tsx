import type { ElementType } from 'react';
import type { LinkProps as MuiLinkProps } from '@mui/material/Link';
import BaseLink from '@mui/material/Link';

export type LinkProps<RootComponent extends ElementType = 'a', AdditionalProps = {}> = MuiLinkProps<
  RootComponent,
  AdditionalProps
>;

export function Link<RootComponent extends ElementType = 'a', AdditionalProps = {}>(
  props: LinkProps<RootComponent, AdditionalProps>,
) {
  return <BaseLink {...props} />;
}
