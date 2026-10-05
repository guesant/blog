export type ListingPaginationProps = {
  page: number;
  pageCount: number;
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
  pageInputLabel: string;
  pageOfLabel: string;
  onPageChange: (page: number) => void | Promise<unknown>;
  scrollTargetId?: string;
};

export type ListingPageNavigationProps = Pick<
  ListingPaginationProps,
  'onPageChange' | 'scrollTargetId'
>;
