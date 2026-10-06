export type ListingPaginationProps = {
  page: number;
  pageCount: number;
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
  pageInputLabel: string;
  onPageChange: (page: number) => void | Promise<unknown>;
};

export type ListingPageNavigationProps = Pick<ListingPaginationProps, 'onPageChange'>;
