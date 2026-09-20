import MuiLink from '@mui/material/Link';
import { createUiComponent, type UiProps } from '../ui-component';
import { linkVariants } from './variants';

export type { LinkProps } from '@mui/material/Link';

export const Link = createUiComponent<typeof MuiLink>(function Link(props: UiProps) {
  return <MuiLink {...(props as Record<string, unknown>)} />;
}, linkVariants);
