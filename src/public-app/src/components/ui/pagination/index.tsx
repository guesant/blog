import MuiPagination from '@mui/material/Pagination';
import { createUiComponent, type UiProps } from '../ui-component';
import { paginationVariants } from './variants';

export const Pagination = createUiComponent<typeof MuiPagination>(function Pagination(
  props: UiProps,
) {
  return <MuiPagination {...(props as Record<string, unknown>)} />;
}, paginationVariants);
