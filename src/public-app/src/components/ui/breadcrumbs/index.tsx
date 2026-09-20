import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import { createUiComponent, type UiProps } from '../ui-component';
import { breadcrumbsVariants } from './variants';

export const Breadcrumbs = createUiComponent<typeof MuiBreadcrumbs>(function Breadcrumbs(
  props: UiProps,
) {
  return <MuiBreadcrumbs {...(props as Record<string, unknown>)} />;
}, breadcrumbsVariants);
