export type ListingPaginationProps = {
  page: number;
  pageCount: number;
  ariaLabel: string;
  firstLabel: string;
  previousLabel: string;
  nextLabel: string;
  lastLabel: string;
  onPageChange: (page: number) => void | Promise<unknown>;
  scrollTargetId?: string;
};
